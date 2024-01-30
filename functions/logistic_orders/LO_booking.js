const createOrder = require("./LO_create_order");
const sendMail = require("../mail/send_mail");

const loBooking = async (req, res) => {
  try {
    const { orderData, shippingData, consigneeData, pickupData } = req.body;
    if (!orderData || !shippingData || !consigneeData || !pickupData) {
      return res.status(400).send("Missing required data in request body.");
    }
    const lrno = "LRNO" + Math.floor(Math.random() * 1000000000);
    if (!lrno) {
      return res.status(500).send("Failed to generate order ID.");
    }
    const order = await createOrder(
        lrno,
        orderData,
        shippingData,
        consigneeData,
        pickupData,
    );

    if (!order) {
      return res.status(500).send("Failed to create order.");
    }
    try {
      await sendMail(
          orderData.email,
          "Order Confirmation",
          lrno,
          consigneeData,
          shippingData,
          pickupData,
      );
    }
    catch (err) {
      console.log(err);
    }
    res.status(200).send(order);
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("An unexpected error occurred.");
  }
};
module.exports = loBooking;
