const axios = require("axios");

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
    await axios(config);
    res.status(200).send("Updated Successfully");
  }
  catch (error) {
    console.error(`Error in axios request: ${error}`);
    res.status(500).send("An error occurred while updating the data.");
  }
};

module.exports = updateShipRocketData;
