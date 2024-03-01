/* eslint-disable camelcase */
// const manifest = require("./handleManifest");
const { db } = require("../controller/db");
const { BookingHandler } = require("./delivery_api_handler");
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
/**
 * Generates an AWB (Air Waybill) for the given collection name.
 * @param {string} collectionName - The name of the collection.
 * @return {string} - The generated AWB.
 */
async function generateAWB(collectionName) {
  const docSnap = await db.collection(collectionName).get();
  const count = docSnap.size + 1;
  const paddedCount = String(count).padStart(7, "0");
  const id = "AWB" + paddedCount;
  return id;
}


/**
 * Calculates the total dimensions based on the given dimensions array.
 * @param {Array} dimensions - The array of dimensions.
 * @return {Object} - The object containing the total length, total width
 */
function calculateTotalDimensions(dimensions) {
  let totalLength = 0;
  let totalWidth = 0;
  let totalHeight = 0;

  dimensions.forEach((dimension) => {
    totalLength += dimension.length * dimension.count;
    totalWidth += dimension.width * dimension.count;
    totalHeight += dimension.height * dimension.count;
  });

  return {
    totalLength,
    totalWidth,
    totalHeight,
  };
}
const loBooking = async (req, res) => {
  try {
    const {
      ident,
      pickup_location,
      dropoff_location,
      return_address,
      d_mode,
      amount,
      rov_insurance,
      invoices,
      weight,
      suborders,
      dimensions,
      consignee_gst_tin,
      seller_gst_tin,
      cb,
      // extras
      payment_mode,

    } = req.body;
    // eslint-disable-next-line new-cap
    const BookingHandlerResponse = await BookingHandler(req.body);
    const orderID = await generateOrderID("logisticOrder");
    const lrno = "LRNO" + Math.floor(Math.random() * 1000000000);
    const awb = await generateAWB("logisticOrder");
    if (!lrno) {
      return res.status(500).send("Failed to generate order ID.");
    }
    // eslint-disable-next-line max-len
    const { totalLength, totalWidth, totalHeight } = calculateTotalDimensions(dimensions);
    const postData = {
      ident: ident,
      pickup_location: pickup_location,
      dropoff_location: dropoff_location,
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
      orderStatus: "Pending",
      orderID: orderID,
      lrno: lrno,
      jobId: BookingHandlerResponse.job_id,
      totalLength: totalLength,
      totalWidth: totalWidth,
      totalHeight: totalHeight,
      masterAWB: awb,
    };
    const docRef = await db.collection("logisticOrder").add(postData);
    postData.uid = docRef.id;
    await docRef.set(postData, { merge: true });
    res.status(200).send({
      message: "Order booked successfully",
      orderStatus: "Pending",
      lrno: lrno,
      masterAWB: awb,
      weight: weight,
      totalLength: totalLength,
      totalHeight: totalHeight,
      totalWidth: totalWidth,
    });
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("An unexpected error occurred.");
  }
};
module.exports = loBooking;
