const axios = require("axios");
const findData = require("../controller/find_data.js");
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
    const { orderID, awbNumber, forwardingAWBNumber } = req.body;
    let doc;

    if (orderID) {
      doc = await findData("ecomOrder", "orderID", orderID);
    }
    else if (awbNumber) {
      doc = await findData("ecomOrder", "awbNumber", awbNumber);
    }
    else if (forwardingAWBNumber) {
      // eslint-disable-next-line max-len
      doc = await findData("ecomOrder", "shiprocket.forwardingAWBNumber", forwardingAWBNumber);
    }
    else {
      // eslint-disable-next-line max-len
      return res.status(400).json({ error: "No orderID, awbNumber or forwardingNumber provided" });
    }

    if (!doc) {
      return res.status(404).json({ error: "Order not found" });
    }

    const shipperData = doc.shipperData;
    const orderIDD= doc.orderID;
    const consigneeData = doc.consigneeData;
    const orderStatus = doc.orderStatus;
    let locationData;
    let data;

    // eslint-disable-next-line max-len
    if (["manifested", "intransit", "delivering", "delivered"].includes(orderStatus.toLowerCase())) {
      locationData = await getLocationData(orderID);
      data = {
        locationData,
        awbNumber: doc.awbNumber,
        forwardingNumber: doc.forwardingNumber || "",
        shipperData,
        consigneeData,
        orderStatus,
      };
      res.status(200).json({ data });
    }
    else {
      res.status(200).json({
        orderID: orderIDD,
        orderStatus: orderStatus,
        message: "Order has not been shipped",
      });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = trackOrder;
