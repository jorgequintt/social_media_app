/* --------------------------------- Consts --------------------------------- */
const functions = require("firebase-functions");
const { admin, db, isTestingEnvironment } = require("./utils/admin");

// Middleware
const {
   fbAuth,
   openRequestsForTests,
   publicRequests,
} = require("./utils/middleware");

/* -------------------------------- Handlers -------------------------------- */
const {
   signupHandler,
   loginHandler,
   uploadImageHandler,
   updateUserProfileHandler,
   getAuthenticatedUserHandler,
   getUserDetailsHandler,
   markNotificationsAsReadHandler,
} = require("./handlers/users");
const {
   getBubblesHandler,
   createBubbleHandler,
   getBubbleHandler,
   createCommentHandler,
   likeBubbleHandler,
   unlikeBubbleHandler,
   deleteBubbleHandler,
} = require("./handlers/bubbles");
const { cleanTestUserDataHandler } = require("./handlers/tests");

/* ---------------------------- Init express app ---------------------------- */
const app = require("express")();
app.use(publicRequests);

// if (isTestingEnvironment) {
//    // If we are on development environment
//    // set up middleware for testing purposes
//    app.use(openRequestsForTests);
// }

/* --------------------------------- Routes --------------------------------- */
// app.get("/ping", (req, res) => res.status(200).send("OK"));
// app.delete("/testUser", cleanTestUserDataHandler);

// User routes
app.post("/signup", signupHandler);
app.post("/login", loginHandler);
app.post("/user", fbAuth, updateUserProfileHandler);
app.post("/user/image", fbAuth, uploadImageHandler);
app.get("/user", fbAuth, getAuthenticatedUserHandler);
app.get("/user/:name", getUserDetailsHandler);
app.post("/notifications", fbAuth, markNotificationsAsReadHandler);

// Bubble routes
app.get("/bubble/:bubbleId", getBubbleHandler);
app.get("/bubbles", getBubblesHandler);
app.post("/bubble", fbAuth, createBubbleHandler);
app.delete("/bubble/:bubbleId", fbAuth, deleteBubbleHandler);
app.post("/bubble/:bubbleId/comment", fbAuth, createCommentHandler);
app.post("/bubble/:bubbleId/like", fbAuth, likeBubbleHandler);
app.post("/bubble/:bubbleId/unlike", fbAuth, unlikeBubbleHandler);

exports.api = functions.region("us-east1").https.onRequest(app);
exports.createNotificationOnLike = functions
   .region("us-east1")
   .firestore.document("/likes/{id}")
   .onCreate((snapshot) => {
      return db
         .doc(`/bubbles/${snapshot.data().bubbleId}`)
         .get()
         .then((doc) => {
            if (doc.exists) {
               return db.doc(`/notifications/${snapshot.id}`).set({
                  createdAt: new Date().toISOString(),
                  recipient: doc.data().userName,
                  sender: snapshot.data().userName,
                  type: "like",
                  read: false,
                  bubbleId: doc.id,
               });
            }
         })
         .catch((err) => {
            console.log(err);
         });
   });

exports.deleteNotificationOnUnlike = functions
   .region("us-east1")
   .firestore.document("/likes/{id}")
   .onDelete((snapshot) => {
      return db
         .doc(`/notifications/${snapshot.id}`)
         .delete()
         .catch((err) => {
            console.log(err);
         });
   });

exports.createNotificationOnComment = functions
   .region("us-east1")
   .firestore.document("/comments/{id}")
   .onCreate((snapshot) => {
      db.doc(`/bubbles/${snapshot.data().bubbleId}`)
         .get()
         .then((doc) => {
            if (doc.exists) {
               return db.doc(`/notifications/${snapshot.id}`).set({
                  createdAt: new Date().toISOString(),
                  recipient: doc.data().userName,
                  sender: snapshot.data().userName,
                  type: "comment",
                  read: false,
                  bubbleId: doc.id,
               });
            }
         })
         .then(() => {
            return;
         })
         .catch((err) => {
            console.log(err);
            return;
         });
   });

exports.onUserImageChange = functions
   .region("us-east1")
   .firestore.document("/users/{userId}")
   .onUpdate((change) => {
      let batch = db.batch();

      if (change.before.data().imageUrl === change.after.data().imageUrl) {
         return;
      }

      const path = require("path");

      const oldImage = path
         .basename(change.before.data().imageUrl)
         .replace("?alt=media", "");

      return (
         db
            .collection("bubbles")
            .where("userName", "==", change.before.data().name)
            .get()
            .then((data) => {
               data.forEach((doc) => {
                  const bubble = db.doc(`/bubbles/${doc.id}`);
                  batch.update(bubble, {
                     userImage: change.after.data().imageUrl,
                  });
               });
               return db
                  .collection("comments")
                  .where("userName", "==", change.before.data().name)
                  .get();
            })
            .then((data) => {
               data.forEach((doc) => {
                  const comment = db.doc(`/comments/${doc.id}`);
                  batch.update(comment, {
                     userImage: change.after.data().imageUrl,
                  });
               });
               return batch.commit();
            })
            // delete old image
            .then(() => {
               const oldImageRef = admin.storage().bucket().file(oldImage);

               if (oldImage === "no-img.png") return;
               return oldImageRef.delete();
            })
            .catch((err) => {
               // err;
               console.log(err);
            })
      );
   });

exports.onBubbleDelete = functions
   .region("us-east1")
   .firestore.document("/bubbles/{bubbleId}")
   .onDelete((snapshot, context) => {
      const bubbleId = context.params.bubbleId;
      const batch = db.batch();

      return db
         .collection("comments")
         .where("bubbleId", "==", bubbleId)
         .get()
         .then((data) => {
            data.forEach((doc) => {
               batch.delete(db.doc(`/comments/${doc.id}`));
            });
            return db
               .collection("likes")
               .where("bubbleId", "==", bubbleId)
               .get();
         })
         .then((data) => {
            data.forEach((doc) => {
               batch.delete(db.doc(`/likes/${doc.id}`));
            });
            return db
               .collection("notifications")
               .where("bubbleId", "==", bubbleId)
               .get();
         })
         .then((data) => {
            data.forEach((doc) => {
               batch.delete(db.doc(`/notifications/${doc.id}`));
            });
            return batch.commit();
         });
   });

console.log("Good to go");
