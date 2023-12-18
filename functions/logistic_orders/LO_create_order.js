const { firestore } = require('../controller/CRUD.js');

async function createOrder(lrno, orderData, shippingData, consigneeData, pickupData) {
    const order = {
        lrno: lrno || "",
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