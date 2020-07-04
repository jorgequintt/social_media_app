const { db } = require("../utils/admin");

exports.getBubblesHandler = (req, res) => {
   let date = new Date().toISOString();
   const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
   if (!!req.query.after && isoDateRegex.test(req.query.after)) {
      date = req.query.after;
   }

   db.collection("bubbles")
      .orderBy("createdAt", "desc")
      .startAfter(date)
      .limit(6)
      .get()
      .then((data) => {
         let bubbles = [];

         data.forEach((doc) =>
            bubbles.push({
               bubbleId: doc.id,
               ...doc.data(),
            })
         );

         return res.json(bubbles);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.createBubbleHandler = (req, res) => {
   const newBubble = {
      body: req.body.body,
      userName: req.user.name,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
   };

   if (newBubble.body.trim() === "") {
      return res.status(400).json({ body: "Must not be empty" });
   }
   db.collection("bubbles")
      .add(newBubble)
      .then((doc) => {
         res.status(201).json({ ...newBubble, bubbleId: doc.id });
      })
      .catch((err) => {
         res.status(500).json({ error: `something went wrong ${err}` });
         console.log(err);
      });
};

exports.getBubbleHandler = (req, res) => {
   let bubbleData = {};

   //TODO validate param
   db.doc(`/bubbles/${req.params.bubbleId}`)
      .get()
      .then((doc) => {
         if (!doc.exists) {
            return res.status(404).json({ error: "Bubble not found" });
         }
         bubbleData = doc.data();
         bubbleData.bubbleId = doc.id;
         return db
            .collection("comments")
            .orderBy("createdAt", "desc")
            .where("bubbleId", "==", doc.id)
            .get();
      })
      .then((data) => {
         bubbleData.comments = [];
         data.forEach((doc) => {
            bubbleData.comments.push(doc.data());
         });
         return res.json(bubbleData);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.createCommentHandler = (req, res) => {
   if (!req.body.body || req.body.body.trim() == "") {
      return res.status(400).json({ comment: "Must not be empty" });
   }

   const newComment = {
      body: req.body.body,
      createdAt: new Date().toISOString(),
      bubbleId: req.params.bubbleId,
      userName: req.user.name,
      userImage: req.user.imageUrl,
   };

   db.doc(`/bubbles/${req.params.bubbleId}`)
      .get()
      .then((doc) => {
         if (!doc.exists)
            return res.status(404).json({ error: "Bubble not found" });
         return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
      })
      .then(() => {
         return db.collection("comments").add(newComment);
      })
      .then(() => {
         return res.json(newComment);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: "Something went wrong" });
      });
};

exports.likeBubbleHandler = (req, res) => {
   const likeDocument = db
      .collection("likes")
      .where("userName", "==", req.user.name)
      .where("bubbleId", "==", req.params.bubbleId)
      .limit(1);

   const bubbleDocument = db.doc(`/bubbles/${req.params.bubbleId}`);

   let bubbleData;
   bubbleDocument
      .get()
      .then((doc) => {
         if (doc.exists) {
            bubbleData = { ...doc.data(), bubbleId: doc.id };
            return likeDocument.get();
         } else {
            return res.status(404).json({ error: "Bubble doesn't exists" });
         }
      })
      .then((data) => {
         if (data.empty) {
            return db
               .collection("likes")
               .add({ bubbleId: bubbleData.bubbleId, userName: req.user.name })
               .then(() => {
                  bubbleData.likeCount++;
                  return bubbleDocument.update({
                     likeCount: bubbleData.likeCount,
                  });
               })
               .then(() => {
                  return res.json(bubbleData);
               });
         } else {
            return res.status(400).json({ error: "Bubble already liked" });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.unlikeBubbleHandler = (req, res) => {
   const likeDocument = db
      .collection("likes")
      .where("userName", "==", req.user.name)
      .where("bubbleId", "==", req.params.bubbleId)
      .limit(1);

   const bubbleDocument = db.doc(`/bubbles/${req.params.bubbleId}`);

   let bubbleData;
   bubbleDocument
      .get()
      .then((doc) => {
         if (doc.exists) {
            bubbleData = { ...doc.data(), bubbleId: doc.id };
            return likeDocument.get();
         } else {
            return res.status(404).json({ error: "Bubble doesn't exists" });
         }
      })
      .then((data) => {
         if (!data.empty) {
            return db
               .doc(`/likes/${data.docs[0].id}`)
               .delete()
               .then(() => {
                  bubbleData.likeCount--;
                  return bubbleDocument.update({
                     likeCount: bubbleData.likeCount,
                  });
               })
               .then(() => {
                  return res.json(bubbleData);
               });
         } else {
            return res.status(400).json({ error: "Bubble not liked" });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.deleteBubbleHandler = (req, res) => {
   const bubbleDoc = db.doc(`/bubbles/${req.params.bubbleId}`);

   bubbleDoc
      .get()
      .then((doc) => {
         if (!doc.exists)
            return res.status(404).json({ error: "Bubble not found" });
         if (doc.data().userName !== req.user.name)
            return res.status(403).json({ error: "Unauthorized" });
         return bubbleDoc.delete();
      })
      .then(() => {
         return res.json({ message: "Bubble deleted" });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};
