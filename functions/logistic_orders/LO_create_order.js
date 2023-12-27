const { firestore } = require('../controller/CRUD.js');
async function generateOrderID(collectionName) {
    const docSnap = await firestore.collection(collectionName).get();
    let count = docSnap.size + 1;
    let paddedCount = String(count).padStart(7, '0');
    let id = "GRC" + paddedCount;
    return id;
  }
async function createOrder(lrno, orderData, shippingData, consigneeData, pickupData) {
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
                products: []
            }
        ],
        shippingData: shippingData || [],
        consigneeData: consigneeData || [],
        pickupData: pickupData || []
    };

    const docRef = await firestore.collection('logisticOrder').add(order);
    return docRef.id;  
}
module.exports = createOrder;