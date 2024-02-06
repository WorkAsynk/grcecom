/*  function viewStatus that handles an HTTP request to view
 the status of an order in an e-commerce system. */
const { findData } = require("../controller/find_data.js");
const viewStatus = async (req, res) => {
  try {
    const { awbNumber, referenceNumber, forwardingNumber } = req.body;

    let docData;

    if (awbNumber) {
      docData = await findData("ecomOrder", "awbNumber", awbNumber);
    }
    else if (referenceNumber) {
      docData = await findData("ecomOrder", "referenceNumber", referenceNumber);
    }
    else if (forwardingNumber) {
      docData = await findData(
          "ecomOrder",
          "forwardingNumber",
          forwardingNumber,
      );
    }

    if (docData) {
      res.status(200).json({
        ordersStatus: docData.ordersStatus,
        deliveryData: docData.destinationData,
        shippingData: docData.consigneeData,
        pickupData: {
          fuelCharges: docData.fuelCharges,
          freightCharges: docData.freightCharges,
          totalPrice: docData.totalPrice,
        },
      });
    }
    else {
      console.log("No such document!");
      res.status(404).json({ error: "No such document!" });
    }
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to retrieve data", message: error.message });
  }
};

module.exports = viewStatus;
