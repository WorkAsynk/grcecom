const axios = require("axios");
const CRUD = require("../controller/CRUD.js");
const updateShipRocketData = async (req, res) => {
  const data = req.body;
  const config = {
    method: "POST",
    url: "https://apiv2.shiprocket.in/v1/external/orders/update/adhoc",
    data: data,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SHIPROCKET_TOKEN}`,
    },
  };

  try {
    await CRUD.updateExistingData("ecomOrder", "orderID", data.orderID, data);
  }
  catch (error) {
    console.error(`Error in database update: ${error}`);
    return res.status(500)
        .send("An error occurred while updating the database.");
  }

  try {
    await axios(config);
  }
  catch (error) {
    console.error(`Error in axios request: ${error}`);
    return res
        .status(500)
        .send("An error occurred while updating the data on ShipRocket.");
  }

  res.status(200).send("Updated Successfully");
};

module.exports = updateShipRocketData;
