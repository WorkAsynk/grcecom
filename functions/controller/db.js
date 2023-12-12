const admin = require("firebase-admin");
const serviceAccount = require("../permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206..firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };