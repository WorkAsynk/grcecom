const { db } = require("../controller/db.js");

const trackOrder = async (req, res) => {
  try {
    const orderID = req.body.orderID;
    const snapshot = await db
        .collection("Orders")
        .where("orderID", "==", orderID)
        .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      res.status(404).json({ error: "No matching documents" });
      return;
    }
    const doc = snapshot.docs[0];
    const awbNumber = doc.data().awbNumber;
    const forwardingNumber = doc.data().forwardingNumber ?
      doc.data().forwardingNumber :
      "";
    const shipperData = doc.data().shipperData;
    const consigneeData = doc.data().consigneeData;
    const orderStatus = doc.data().orderStatus;
    res.status(200).json({
      awbNumber,
      forwardingNumber,
      shipperData,
      consigneeData,
      orderStatus,
    });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = trackOrder;
