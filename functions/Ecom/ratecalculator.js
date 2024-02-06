/* eslint-disable max-len */
const NodeGeocoder = require("node-geocoder");
const geolib = require("geolib");

const baseFreightUnitPrice = 100; // 1kg = 100rs
const baseFuelUnitPrice = 50; // 1km = 50rs
const gstRate = 0.18; // GST rate

const options = {
  provider: "openstreetmap",
};

// eslint-disable-next-line new-cap
const geocoder = NodeGeocoder(options);

const RateCalculator = async (req, res) => {
  try {
    const {
      pickupPincode,
      deliveryPincode,
      // weight,
      height,
      width,
      length,
    } = req.body;

    const pickupLocation = await geocoder.geocode(pickupPincode);
    const deliveryLocation = await geocoder.geocode(deliveryPincode);

    const dist =
      geolib.getDistance(
          {
            latitude: pickupLocation[0].latitude,
            longitude: pickupLocation[0].longitude,
          },
          {
            latitude: deliveryLocation[0].latitude,
            longitude: deliveryLocation[0].longitude,
          },
      ) / 1000; // Convert from meters to kilometers

    const volume = (width * height * length * baseFreightUnitPrice) / 4500;
    const fuelCharges = dist * baseFuelUnitPrice;
    const totalCharges = volume + fuelCharges;
    const gst = totalCharges * gstRate;

    const totalChargesIncludingGST = totalCharges + gst;

    res.json({ totalCharges: totalChargesIncludingGST });
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to calculate rate", message: error.message });
  }
};

module.exports = RateCalculator;
