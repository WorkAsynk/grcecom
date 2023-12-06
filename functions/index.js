const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({origin: true}));
const serviceAccount = require("./permission.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206..firebaseio.com",
});
const db = admin.firestore();

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Go Fuck Yourself");
});
app.post("/api/createOrder", (req, res) => {
  (async () => {
    try {
      await db.collection("deliveryOrder").doc("/" + req.body.orderId + "/")
          .create({
            orderId: req.body.orderId,
            location: req.body.location,
            status: "pending",
          });
      return res.status(200).send("Order Created Sucessfully");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
