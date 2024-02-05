/* eslint-disable camelcase */
// const manifest = require("./handleManifest");
const { db } = require("../controller/db");
/**
 * Generates an order ID for the given collection name.
 * @param {string} collectionName - The name of the collection.
 * @return {string} - The generated order ID.
 */
async function generateOrderID(collectionName) {
  const docSnap = await db.collection(collectionName).get();
  const count = docSnap.size + 1;
  const paddedCount = String(count).padStart(7, "0");
  const id = "GRC" + paddedCount;
  return id;
}

const loBooking = async (req, res) => {
  try {
    const {
      ident,
      pickup_location,
      drop_off_location,
      return_address,
      d_mode,
      amount,
      payment_mode = "prepaid",
      rov_insurance,
      invoices,
      weight,
      suborders,
      dimensions,
      consignee_gst_tin,
      seller_gst_tin,
      cb,
      OrderStaus = "Pending",
    } = req.body;

    const orderID = await generateOrderID("logisticOrder");
    const lrno = "LRNO" + Math.floor(Math.random() * 1000000000);
    if (!lrno) {
      return res.status(500).send("Failed to generate order ID.");
    }
    const postData = {
      ident: ident,
      pickup_location: pickup_location,
      drop_off_location: drop_off_location,
      return_address: return_address,
      d_mode: d_mode,
      amount: amount,
      payment_mode: payment_mode,
      rov_insurance: rov_insurance,
      invoices: invoices,
      weight: weight,
      suborders: suborders,
      dimensions: dimensions,
      consignee_gst_tin: consignee_gst_tin,
      seller_gst_tin: seller_gst_tin,
      cb: cb,
      orderStatus: OrderStaus,
      orderID: orderID,
    };
    const docRef = await db.collection("logisticOrder").add(postData);
    postData.uid = docRef.id;
    await docRef.set(postData, { merge: true });
    res.status(200).send(postData);
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("An unexpected error occurred.");
  }
};
module.exports = loBooking;
