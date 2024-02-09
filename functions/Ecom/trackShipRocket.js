const findData = require("../controller/find_data.js");
const axios = require("axios");
const CRUD = require("../controller/CRUD.js");

const trackAndUpdate = async (trackFunction, fieldName, fieldValue, res) => {
  try {
    const response = await trackFunction(fieldValue);
    await CRUD.updateDataAccordingToField(
        "ecomOrder",
        fieldName,
        fieldValue,
        "locationData",
        response,
    );
    res.status(200).send(response);
  }
  catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while tracking the shipment.");
  }
};

const trackShipRocket = async (req, res) => {
  const { orderID, awbNumber, forwardingAWBNumber } = req.body;

  if (forwardingAWBNumber) {
    trackAndUpdate(
        trackByForwardingAWBNumber,
        "forwardingAWBNumber",
        forwardingAWBNumber,
        res,
    );
  }
  else if (awbNumber) {
    trackAndUpdate(trackByAWBNumber, "awbNumber", awbNumber, res);
  }
  else if (orderID) {
    trackAndUpdate(trackByOrderID, "orderID", orderID, res);
  }
  else {
    res.status(400).send("Invalid Input");
  }
};

const axiosGet = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SHIPROCKET_TOKEN}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error(`Error in axios GET request: ${error}`);
    throw error;
  }
};

const trackByForwardingAWBNumber = async (forwardingAWBNumber) => {
  const url = `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${forwardingAWBNumber}`;
  return await axiosGet(url);
};

const trackByAWBNumber = async (awbNumber) => {
  const data = await findData("ecomOrder", "awbNumber", awbNumber);
  if (!data) {
    throw new Error(`No document found with awbNumber: ${awbNumber}`);
  }
  const forwardingOrderID = data.shiprocket.forwardingOrderID;
  const url = `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${forwardingOrderID}`;
  return await axiosGet(url);
};

const trackByOrderID = async (orderID) => {
  const data = await findData("ecomOrder", "orderID", orderID);
  if (!data) {
    throw new Error(`No document found with orderID: ${orderID}`);
  }
  const forwardingOrderID = data.shiprocket.forwardingOrderID;
  const url = `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${forwardingOrderID}`;
  return await axiosGet(url);
};
module.exports = trackShipRocket;

