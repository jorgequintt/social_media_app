const isTestingEnvironment = process.env.FUNCTIONS_EMULATOR === "true";
exports.isTestingEnvironment = isTestingEnvironment;

const config = require('./firebase_config')

const admin = require('firebase-admin');
const adminConfig = {
   databaseURL: config.databaseURL,
   storageBucket: config.storageBucket
};
if (isTestingEnvironment) {
   // service account for firebase admin. Needed to emulate firestore apparently
   const serviceAccount = require(`../../../bubbler_service_account.json`);
   adminConfig.credential = admin.credential.cert(serviceAccount);
}
admin.initializeApp(adminConfig);
exports.admin = admin;
exports.db = admin.firestore();

const firebase = require('firebase');
firebase.initializeApp(config);
exports.firebase = firebase;

exports.storage_url = filename => `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${filename}`;