const { db } = require("../controller/db");

const CreateNewPickupRequest = async (req, res) => {
  try {
    const { uid, location, expectedPackages, date, time } = req.body;
    const data = {
      uid,
      location,
      expectedPackages,
      date,
      time,
    };
    await db.collection("pickUpRequest").add(data);
    res.status(200).send("successfully created");
  }
  catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = CreateNewPickupRequest;
