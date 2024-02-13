const { db } = require("../controller/db.js");
const axios = require("axios");
const getLocationData = async (orderID) => {
  try {
    const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=` +
        orderID +
        "",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.SHIPROCKET_TOKEN,
          },
        },
    );
    console.log("Location data: ", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error getting location data: ", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data: ", error.response.data);
      console.error("Response status: ", error.response.status);
      console.error("Response headers: ", error.response.headers);
    }
    else if (error.request) {
      // The request was made but no response was received
      console.error("Request: ", error.request);
    }
    else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message: ", error.message);
    }
    throw error; // Re-throw the error to be handled by the calling function
  }
};

const trackOrder = async (req, res) => {
  try {
    const orderID = req.body.orderID;
    const snapshot = await db
        .collection("ecomOrder")
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
    let locationData;
    if (orderStatus === "Manifest") {
      locationData = await getLocationData(orderID);
    }
    res.status(200).json({
      awbNumber,
      forwardingNumber,
      shipperData,
      consigneeData,
      orderStatus,
      locationData,
    });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = trackOrder;
