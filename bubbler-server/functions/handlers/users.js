const { db, admin, firebase, storage_url } = require("../utils/admin");
const {
   validateSignup,
   validateLogin,
   reduceUserProfileData,
} = require("../utils/validators");
const Busboy = require("busboy");
const sharp = require("sharp");

exports.signupHandler = (req, res) => {
   // Validate
   const validation = validateSignup(req.body);
   if (!validation.success) return res.status(400).json(validation.errors);

   // ...proceed
   const { email, password, confirmPassword, name } = req.body;
   let newUser = {
      email,
      name,
      imageUrl: storage_url("no-img.png") + "?alt=media",
      createdAt: new Date().toISOString(),
   };
   let token;
   db
      // get document with given username
      .doc(`/users/${name}`)
      .get()
      .then((doc) => {
         // We check if document exists. If not, create and continue
         if (doc.exists) {
            return res
               .status(400)
               .json({ name: "This username already exists" });
         } else {
            return firebase
               .auth()
               .createUserWithEmailAndPassword(email, password);
         }
      })
      // We save user id from Authentication and proceed to retrieve token id
      .then((data) => {
         newUser.userId = data.user.uid;
         return data.user.getIdToken();
      })
      // Set retrieved token in variable and create user document in collection
      .then((userToken) => {
         token = userToken;
         return db.doc(`/users/${name}`).set(newUser);
      })
      .then(() => res.status(201).json({ token }))
      .catch((err) => {
         if (err.code == "auth/email-already-in-use")
            return res.status(400).json({ email: "Email already in use" });
         if (err.code == "auth/weak-password")
            return res.status(400).json({ password: "Weak password" });

         console.log(err);
         return res
            .status(500)
            .json({ general: "Something went wrong. Please try again" });
      });
};

exports.loginHandler = (req, res) => {
   // Validation
   const validation = validateLogin(req.body);
   if (!validation.success) return res.status(500).json(validation.errors);

   const { email, password } = req.body;
   firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userData) => userData.user.getIdToken())
      .then((token) => res.json({ token }))
      .catch((err) => {
         if (err.code == "auth/wrong-password")
            return res.status(400).json({ password: "Wrong password" });
         if (err.code == "auth/user-not-found")
            return res
               .status(400)
               .json({ email: "Email not found in database" });

         console.log(err);
         return res
            .status(500)
            .json({ general: "Wrong credentials. Please try again" });
      });
};

exports.updateUserProfileHandler = (req, res) => {
   const data = reduceUserProfileData(req.body);

   db.doc(`/users/${req.user.name}`)
      .update(data)
      .then(() => {
         return res.json({ message: "user profile updated successfully" });
      })
      .catch((err) => {
         return res.status(500).json({ error: err.code });
      });
};

exports.uploadImageHandler = (req, res) => {
   const [path, os, fs] = [require("path"), require("os"), require("fs")];
   // const busboy = new Busboy({ headers: req.headers, limits: { files: 1 } });
   const busboy = new Busboy({ headers: req.headers });

   let imageFilename, imageToBeUploaded;

   busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(mimetype)) {
         return res.status(400).json({ message: "Wrong file type submitted" });
      }

      const imageExtension = ".jpg";
      // const imageExtension = path.extname(filename);
      imageFilename = `${new Date().getTime()}${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFilename);
      imageToBeUploaded = { filepath, mimetype: "image/jpeg" };
      // imageToBeUploaded = { filepath, mimetype };

      const profilePictureFormat = sharp()
         .resize({
            width: 350,
            height: 350,
            fit: sharp.fit.cover,
            position: sharp.strategy.attention,
         })
         .jpeg({ quality: 80 });

      // file.pipe(profilePictureFormat).pipe(fs.createWriteStream(filepath));
      file.pipe(fs.createWriteStream(filepath));
   });

   busboy.on("finish", () => {
      sharp(imageToBeUploaded.filepath)
         .resize({
            width: 350,
            height: 350,
            fit: sharp.fit.cover,
            position: sharp.strategy.attention,
         })
         .jpeg({ quality: 80 })
         .toBuffer()
         .then((data) => {
            return fs.writeFileSync(imageToBeUploaded.filepath, data);
         })
         .then(() => {
            return admin
               .storage()
               .bucket()
               .upload(imageToBeUploaded.filepath, {
                  resumable: false,
                  metadata: {
                     metadata: {
                        contentType: imageToBeUploaded.mimetype,
                     },
                  },
               });
         })
         .then(() => {
            const imageUrl = storage_url(imageFilename) + "?alt=media";
            return db.doc(`/users/${req.user.name}`).update({ imageUrl });
         })
         .then(() => {
            return res
               .status(201)
               .json({ message: "Image uploaded successfully" });
         })
         .catch((err) => {
            return res.status(500).json({ error: err.code });
         });
   });

   busboy.end(req.rawBody);
};

exports.getAuthenticatedUserHandler = (req, res) => {
   let userData = {};
   db.doc(`/users/${req.user.name}`)
      .get()
      .then((doc) => {
         if (doc.exists) {
            userData.credentials = doc.data();
            return db
               .collection("likes")
               .where("userName", "==", req.user.name)
               .get();
         }
      })
      .then((data) => {
         userData.likes = [];
         data.forEach((doc) => {
            userData.likes.push(doc.data());
         });

         return db
            .collection("notifications")
            .where("recipient", "==", req.user.name)
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();
      })
      .then((data) => {
         userData.notifications = [];
         data.forEach((doc) => {
            userData.notifications.push({
               ...doc.data(),
               notificationId: doc.id,
            });
         });
         return res.json(userData);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.getUserDetailsHandler = (req, res) => {
   let userData = {};
   db.doc(`/users/${req.params.name}`)
      .get()
      .then((doc) => {
         if (doc.exists) {
            userData.user = doc.data();
            return db
               .collection("bubbles")
               .where("userName", "==", req.params.name)
               .orderBy("createdAt", "desc")
               .get();
         } else {
            return res.status(404).json({ error: "User not found" });
         }
      })
      .then((data) => {
         userData.bubbles = [];
         data.forEach((doc) => {
            userData.bubbles.push({
               ...doc.data(),
               bubbleId: doc.id,
            });
         });

         return res.json(userData);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};
exports.markNotificationsAsReadHandler = (req, res) => {
   const batch = db.batch();
   req.body.forEach((notificationId) => {
      const notificationDoc = db.doc(`/notifications/${notificationId}`);
      batch.update(notificationDoc, { read: true });
   });
   batch
      .commit()
      .then(() => {
         return res.json({ message: "Notification marked read" });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
};
