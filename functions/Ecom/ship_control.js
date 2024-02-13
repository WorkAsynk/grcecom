const axios = require("axios");

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
module.exports = { returnInvoice, getTotalPrice };
