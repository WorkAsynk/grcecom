const axios = require("axios");
const findData = require("../controller/find_data");
const token = process.env.SHIPROCKET_TOKEN;
const returnInvoice = async (orderID) => {
  try {
    const response = await axios
        .post(
            "https://apiv2.shiprocket.in/v1/external/orders/print/invoice",
            {
              ids: [`${orderID}`],
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
            },
        );

    return response.data.invoice_url;
  }
  catch (error) {
    if (error.response) {
      console.log("\n\nError in returnInvoice: ", error.response.data);
    }
    else if (error.request) {
      console.log("\n\nError in returnInvoice: ", error.request);
    }
    else {
      console.log("\n\nError in returnInvoice: ", error.message);
    }
    throw error;
  }
};

const getTotalPrice = async () => {
  try {
    const response = await axios.get(
        "https://apiv2.shiprocket.in/v1/external/orders",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        },
    );
    console.log("Response: ", response.data);
    if (response.data && Array.isArray(response.data.data)) {
      let total = 0;
      for (const order of response.data.data) {
        total += parseFloat(order.total);
      }
      return total;
    }
    else {
      throw new Error("Unexpected response structure");
    }
  }
  catch (error) {
    console.error(`Error in getTotalPrice: ${error.message}`);
    throw error;
  }
};
const getLabels = async (req, res) => {
  try {
    const { orderID } = req.body;
    const data = await findData("ecomOrder", "orderID", orderID);
    const shipmentId = data.shiprocket.shipment_id;
    const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/generate/label",
        {
          shipment_id: [`${shipmentId}`],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        },
    );
    res.status(200).json(response.data);
  }
  catch (error) {
    console.error(`Error in getLabels: ${error.message}`);
    throw error;
  }
};

const shipInvoice = async (req, res) => {
  try {
    const { orderID }= req.body;
    const data = await findData("ecomOrder", "orderID", orderID);
    const forwardingOrderID = data.shiprocket.forwardingOrderID;
    const invoiceUrl = await returnInvoice(forwardingOrderID);
    res.status(200).json({ invoiceUrl });
  }
  catch (error) {
    console.error(`Error in sendInvoice: ${error.message}`);
    throw error;
  }
};
module.exports = { returnInvoice, getTotalPrice, getLabels, shipInvoice };
