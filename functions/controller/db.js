const admin = require("firebase-admin");
const serviceAccount = require("../permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206.firebaseio.com",
  storageBucket: "gs://grc-logistics.appspot.com",
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const messaging = admin.messaging();

module.exports = { db, auth, storage, messaging };
