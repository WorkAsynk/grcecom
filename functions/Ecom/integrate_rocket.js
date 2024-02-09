const axios = require("axios");
const functions = require("firebase-functions");
const CircularJSON = require("circular-json");
const CRUD = require("../controller/CRUD.js");
const shipRocketBookingIntegration = async (data) => {
  try {
    functions.logger.info("\n\nData: ", data + "\n\n");
    const Data = {
      order_id: data.orderID,
      order_date: data.bookingData.createdDate,
      pickup_location: "Primary",
      channel_id: "",
      comment: "",
      billing_customer_name: data.consigneeData.consigneeName,
      billing_last_name: "",
      billing_address: data.destinationData.destinationLocation,
      billing_address_2: "",
      billing_city: data.destinationData.destinationCity,
      billing_pincode: data.destinationData.destinationCode,
      billing_state: data.destinationData.destinationState,
      billing_country: "India",
      billing_email: data.consigneeData.consigneeEmail,
      billing_phone: data.consigneeData.consigneePhone,
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: data.freightData.productList,
      payment_method: data.bookingData.paymentMode,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: data.totalPrice,
      length: 10,
      breadth: 15,
      height: data.height,
      weight: data.weight,
    };
    const token = process.env.SHIPROCKET_TOKEN;
    functions.logger.info("Data: ", CircularJSON.stringify(Data));
    const response = await axios
        .post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            Data,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
            },
        )
        .catch((error) => {
          if (error.response) {
            // eslint-disable-next-line max-len
            functions.logger.error("\n\nResponse Error: ", CircularJSON.stringify(error.response.data));
          }
          else if (error.request) {
            functions.logger.error("\n\nRequest Error: ", error.request);
          }
          else {
            functions.logger.error("\n\nError: ", error.message);
          }
          throw error;
        });

    functions.logger.info("Response: ", response);
    const forwardingOrderID = response.data.order_id;
    // eslint-disable-next-line camelcase
    const shipment_id = response.data.shipment_id;
    const forwardingAWBNumber = response.data.awb_code;
    const updateData = {
      forwardingOrderID: forwardingOrderID ? forwardingOrderID : "",
      // eslint-disable-next-line camelcase
      shipment_id: shipment_id ? shipment_id : "",
      forwardingAWBNumber: forwardingAWBNumber ? forwardingAWBNumber : "",
    };

    CRUD.updateDataAccordingToField("ecomOrder",
        "orderID",
        data.orderID,
        "shiprocket",
        updateData);
    return response;
  }
  catch (error) {
    functions.logger.error("\n\nError: ", error);
    return error;
  }
};

module.exports = shipRocketBookingIntegration;
