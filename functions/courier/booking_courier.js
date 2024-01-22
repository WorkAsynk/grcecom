/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

const CRUD = require("../controller/CRUD.js");
// const db = require("../controller/db.js");
const NodeGeocoder = require("node-geocoder");
const geolib = require("geolib");

const baseFreightUnitPrice = 100; // 1kg = 100rs
const baseFuelUnitPrice = 50; // 1km = 50rs
const gstRate = 0.18; // GST rate
const { db } = require("../controller/db.js");

// eslint-disable-next-line require-jsdoc
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
// eslint-disable-next-line require-jsdoc
function OrdersStatus() {
  const status = ["Pending", "In Transit", "Delivered", "Cancelled"];
  return status[0];
}
const findTotalWeight = (productList) => {
  if (productList.length !== 0) {
    let totalWeight = 0;
    productList.map((product) => {
      totalWeight = totalWeight + Number(product.weight);
    });
    return totalWeight;
  }
  else {
    return 0;
  }
};
const findTotalWidth = (productList) => {
  if (productList.length !== 0) {
    let totalWidth = 0;
    productList.map((product) => {
      totalWidth = totalWidth + Number(product.width);
    });
    return totalWidth;
  }
  else {
    return 0;
  }
};
const findTotalHeight = (productList) => {
  if (productList.length !== 0) {
    let totalHeight = 0;
    productList.map((product) => {
      totalHeight = totalHeight + Number(product.height);
    });
    return totalHeight;
  }
  else {
    return 0;
  }
};

async function generateOrderID(collectionName) {
  const docSnap = await db.collection(collectionName).get();
  const count = docSnap.size + 1;
  const paddedCount = String(count).padStart(7, "0");
  const id = "GRC" + paddedCount;
  return id;
}
async function ShipmentPrice(
    pickupPincode,
    deliveryPincode,
    width,
    height,
    weight,
) {
  const options = {
    provider: "openstreetmap",
  };

  // eslint-disable-next-line new-cap
  const geocoder = NodeGeocoder(options);

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

  const freightCharges = Math.round(
      width * height * weight * baseFreightUnitPrice,
  );
  const fuelCharges = Math.round(dist * baseFuelUnitPrice);
  const totalCharges = freightCharges + fuelCharges;
  const gst = totalCharges * gstRate;
  const totalPrice = Math.round(totalCharges + gst);
  return {
    totalPrice,
    freightCharges,
    fuelCharges,
  };
}
const BookingCourier = async (req, res) => {
  try {
    const {
      destinationData,
      freightData,
      consigneeData,
      shipperData,
      bookingData,
      uid,
      bookingType,
    } = req.body;
    const documentName = generateRandomString(10);

    const awbNumber = generateRandomString(10);
    const referenceNumber = generateRandomString(7);
    // eslint-disable-next-line new-cap
    const ordersStatus = OrdersStatus();
    const width = findTotalWidth(freightData.productList);
    const height = findTotalHeight(freightData.productList);
    const weight = findTotalWeight(freightData.productList);
    const orderID = await generateOrderID("courier");
    // eslint-disable-next-line new-cap
    const { totalPrice, freightCharges, fuelCharges } = await ShipmentPrice(
        consigneeData.pickupPincode,
        destinationData.destinationCode,
        width,
        height,
        weight,
    );
    console.log(totalPrice, "hii");
    if (totalPrice !== 0) {
      const data = {
        destinationData,
        freightData,
        consigneeData,
        shipperData,
        bookingData,
        ordersStatus,
        awbNumber,
        referenceNumber,
        totalPrice,
        fuelCharges,
        freightCharges,
        weight,
        height,
        width,
        uid,
        orderID,
        bookingType,
      };
      await CRUD.createData("courier", documentName, data);
      res.status(201).json({
        message: "Your shipment is booked",
        awbNumber,
        referenceNumber,
        ordersStatus,
        totalPrice,
        fuelCharges,
        freightCharges,
        uid,
        bookingType,
      });
    }
  }
  catch (error) {
    res
        .status(500)
        .json({ error: "Failed to save data", message: error.message });
  }
};

module.exports = BookingCourier;
