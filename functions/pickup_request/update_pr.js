const { db } = require("../controller/db");

const updatePickupRequest = async (req, res) => {
  try {
    const { uid, Data } = req.body;
    const docRef = db.collection("pickUpRequest").where("uid", "==", uid);
    const snapshot = await docRef.get();
    if (snapshot.empty) {
      res.status(404).send("No document found with the provided uid");
      return;
    }
    snapshot.forEach((doc) => {
      db.collection("pickUpRequest").doc(doc.id).update(Data);
    });
    res.status(200).send("Document successfully updated");
  }
  catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = updatePickupRequest;
