const CRUD = require("../controller/CRUD.js");
const axios = require("axios");
const findData= require("../controller/find_data.js");
const getAWB = async (shipmentId) => {
  const config = {
    method: "POST",
    url: `https://apiv2.shiprocket.in/v1/external/courier/assign/awb/`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SHIPROCKET_TOKEN}`,
    },
    data: {
      shipment_id: shipmentId,
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  }
  catch (error) {
    console.error(`Error in axios request: ${error}`);
    return null;
  }
};
const generateAndUpdateAWB = async (req, res) => {
  const orderID = req.body.orderID;
  const Data = await findData("ecomOrder", "orderID", orderID);
  console.log(Data);
  if (Data === null) {
    return res.status(500).send("An error occurred while fetching the data.");
  }
  const shipmentId = Data.shipmentId;
  const responseData = await getAWB(shipmentId);
  if (responseData === null) {
    return res.status(500).send("An error occurred while generating AWB.");
  }
  const forwardingAWB = responseData.response.data.awb_code;
  const data = {
    forwardAWB: forwardingAWB,
  };
  try {
    await CRUD
        .updateDataAccordingToField("ecomOrder",
            "orderId",
            orderID,
            "forwardAWBshipmentData",
            forwardingAWB);
  }
  catch (error) {
    console.error(`Error in database update: ${error}`);
    return res
        .status(500)
        .send("An error occurred while updating the database.");
  }
  res.status(200).send(data);
};
module.exports = generateAndUpdateAWB;
