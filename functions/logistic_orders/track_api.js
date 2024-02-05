const axios = require("axios");
const { db } = require("../controller/db");
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

const trackApi = async (req, res) => {
  try {
    let { lrnum, lrnumber } = req.body;

    if (!lrnum && lrnumber) {
      const snapshot = await db
          .collection("logisticOrder")
          .where("lrnumber", "==", lrnumber)
          .get();
      if (snapshot.empty) {
        return res.status(400).send("No matching documents.");
      }
      // Get the first matching document
      const doc = snapshot.docs[0];
      lrnum = doc.data().lrnum;
    }
    const trackingData = await getTrackingData(lrnum);

    // Add the tracking data to the logisticOrder document
    const snapshot = await db
        .collection("logisticOrder")
        .where("lrnum", "==", lrnum)
        .get();
    if (snapshot.empty) {
      return res.status(400).send("No matching documents.");
    }
    // Get the first matching document
    const doc = snapshot.docs[0];
    const docRef = doc.ref;
    await docRef.update({ trackingData });
    res.status(200).send(trackingData);
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("An unexpected error occurred.");
  }
};
module.exports = trackApi;
