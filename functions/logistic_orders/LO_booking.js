const createOrder = require("./LO_create_order");
async function generateOrderID(collectionName) {
    const docSnap = await firestore.collection(collectionName).get();
    let count = docSnap.size + 1;
    let paddedCount = String(count).padStart(7, '0');
    let id = "GRC" + paddedCount;
    return id;
  }
  
const LO_Booking = async (req, res) => {
    try {
        const {
            orderData,
            shippingData,
            consigneeData,
            pickupData,
        } = req.body;

        if (!orderData || !shippingData || !consigneeData || !pickupData) {
            return res.status(400).send("Missing required data in request body.");
        }
        const lrno = 'LRNO' + Math.floor(Math.random() * 1000000000);
        if (!lrno) {
            return res.status(500).send("Failed to generate order ID.");
        }
        const order = await createOrder(lrno, orderData, shippingData, consigneeData, pickupData);
        if (!order) {
            return res.status(500).send("Failed to create order.");
        }
        res.status(200).send(order);
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        res.status(500).send("An unexpected error occurred.");
    }
};
module.exports = LO_Booking;
