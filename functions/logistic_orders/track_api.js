const axios = require("axios");
const getTrackingData = async (lrnum) => {
  const accessToken = process.env.DELHIVERY_ACCESS_TOKEN;
  const url = "https://btob-api-dev.delhivery.com/v3/track/" + `${lrnum}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  };
  const options = {
    method: "get",
    headers: headers,
  };
  const response = await axios(url, options);
  return response.data;
};
const trackAPI = async (req, res) => {
  try {
    const { lrnum } = req.body;
    const trackingData = await getTrackingData(lrnum);
    if (!trackingData) {
      return res.status(500).send("Failed to get tracking data.");
    }
    return res.status(200).send(trackingData);
  }
  catch (error) {
    return res.status(500).send("Failed to get tracking data.");
  }
};
module.exports = trackAPI;
