const {db, admin, isTestingEnvironment} = require('../utils/admin');

exports.cleanTestUserDataHandler = (req, res) => {
   // For unit testing only
   if (!isTestingEnvironment) {
      return res.status(403);
   }

   let uid, userName;
   admin.auth().getUserByEmail("mytestuser@faketestdomain.not")
      .then(userData => {
         uid = userData.uid;
         return admin.auth().deleteUser(uid);
      })
      // delete user from collection
      .then(() => {
         return db.collection('users').where('userId', "==", uid).get();
      })
      .then(snapshot => {
         snapshot.forEach(doc => {
            userName = doc.data().name;
            doc.ref.delete();
         });
      })
      // delete bubbles
      .then(() => {
         return db.collection('bubbles').where('userName', "==", userName).get();
      })
      .then(snapshot => {
         snapshot.forEach(doc => {
            doc.ref.delete();
         });
      })
      .then(() => {
         return res.status(200).json({ message: "test user deleted" });
      })
      .catch(err => {
         console.log(err);
         return res.status(400).json({ error: err.code });
      });
}