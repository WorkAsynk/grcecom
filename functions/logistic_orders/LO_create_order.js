const { db } = require("../controller/db.js");
/**
 * Generates an order ID for the given collection name.
 * @param {string} collectionName - The name of the collection.
 * @return {string} - The generated order ID.
 */
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
 @param {string} lrno - The logistic reference number.
    @param {object} orderData - The order data.
    @param {object} shippingData - The shipping data.
    @param {object} consigneeData - The consignee data.
    @param {object} pickupData - The pickup data.
    @return {string} - The ID of the created order.
    */
async function createOrder(
    lrno,
    orderData,
    shippingData,
    consigneeData,
    pickupData,
) {
  const orderID = await generateOrderID("logisticOrder");
  const order = {
    lrno: lrno || "",
    orderID: orderID || "",
    orderData: orderData || [
      {
        awbnumber: "",
        width: "",
        height: "",
        length: "",
        weight: "",
        products: [],
      },
    ],
    shippingData: shippingData || [],
    consigneeData: consigneeData || [],
    pickupData: pickupData || [],
  };

  const docRef = await db.collection("logisticOrder").add(order);
  order.uid = docRef.id;
  await docRef.set(order, { merge: true });
  return docRef.id;
}
module.exports = createOrder;
