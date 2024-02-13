/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

const CRUD = require("../controller/CRUD.js");
// const db = require("../controller/db.js");
const NodeGeocoder = require("node-geocoder");
const geolib = require("geolib");
const shipControl = require("./ship_control.js");

const baseFreightUnitPrice = 100; // 1kg = 100rs
const baseFuelUnitPrice = 50; // 1km = 50rs
const gstRate = 0.18; // GST rate
const shipRocketBookingIntegration = require("./integrate_rocket.js");
// const sendEmail = require("../mail/mail_controller.js");
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
function OrderStatus() {
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
// function that generates orderID

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
const Booking = async (req, res) => {
  try {
    const {
      destinationData,
      freightData,
      consigneeData,
      shipperData,
      bookingData,
      uid,
      orderData,
      orderID,
      awbNumber,
      length,
    } = req.body;
    const documentName = generateRandomString(10);

    const referenceNumber = generateRandomString(7);
    // eslint-disable-next-line new-cap
    const orderStatus = OrderStatus();
    const width = findTotalWidth(freightData.productList);
    const height = findTotalHeight(freightData.productList);
    const weight = findTotalWeight(freightData.productList);
    // eslint-disable-next-line new-cap
    const { totalPrice, freightCharges, fuelCharges } = await ShipmentPrice(
        consigneeData.pickupPincode,
        destinationData.destinationCode,
        width,
        height,
        weight,
    );
    const volumetricWeight = (width * height * length) / 5000;
    if (totalPrice !== 0) {
      const data = {
        destinationData,
        freightData,
        consigneeData,
        shipperData,
        bookingData,
        orderStatus,
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
        orderData,
        length,
        volumetricWeight,
      };
      await CRUD.createData("ecomOrder", documentName, data);
      const response = await shipRocketBookingIntegration(data);
      const totalCharges = await shipControl.getTotalPrice();
      const invoice = await shipControl.returnInvoice(response.data.order_id);
      console.log(`Total CHarges: ${totalCharges}`);
      await CRUD.updateData("ecomOrder", documentName, { invoice: invoice });
      await CRUD.updateData("ecomOrder", documentName, { totalCharges: totalCharges });


      console.log("Data saved successfully");

      console.log("Data saved successfully");
      // try {
      //   await sendEmail(
      //       shipperData.email,
      //       "Booking Confirmation",
      //       awbNumber,
      //       consigneeData,
      //       destinationData,
      //   );
      // }
      // catch (error) {
      //   console.log(`Error sending email: ${error}`);
      // }
      if (response.status === 200) {
        res.status(200).json({ message: "Booking Successful" });
      }
      else {
        res.status(500).json({ message: "Booking Failed" });
      }
    }
  }
  catch (error) {
    res
        .status(500)
        .json({ error: "Failed to save data", message: error.message });
  }
};

module.exports = Booking;
