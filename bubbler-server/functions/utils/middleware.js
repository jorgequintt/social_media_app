const { db, admin } = require("../utils/admin");

exports.fbAuth = (req, res, next) => {
   let idToken;
   const authorization = req.headers.authorization;
   if (!!authorization && authorization.indexOf("Bearer ") === 0) {
      idToken = authorization.split(" ")[1];
   } else {
      return res.status(403).json({ error: "Not authorized" });
   }

   admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
         req.user = decodedToken;
         return db
            .collection("users")
            .where("userId", "==", decodedToken.uid)
            .limit(1)
            .get();
      })
      .then((snapshot) => {
         const { name, imageUrl } = snapshot.docs[0].data();
         req.user.name = name;
         req.user.imageUrl = imageUrl;
         next();
      })
      .catch((err) => {
         console.log(err);
         return res.status(403).json({ error: err.code });
      });
};

exports.openRequestsForTests = (req, res, next) => {
   res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers":
         "Origin, Authorization, Content-Type, Accept",
   });
   next();
};

exports.publicRequests = (req, res, next) => {
   res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers":
         "Origin, Authorization, Content-Type, Accept",
   });
   next();
};
