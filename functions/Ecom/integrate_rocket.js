const axios = require("axios");
const functions = require("firebase-functions");
const data = {
  destinationData: {
    destinationLocation: "Mira Road",
    destinationCity: "Mumbai",
    destinationCode: "401107",
    destinationState: "Maharastra",
  },
  freightData: {
    productList: [
      {
        product_id: "1",
        product_name: "Product 1",
        quantity: 2,
        price: 10,
        height: "15",
        weight: "10",
        breadth: "4",
        width: "5",
      },
      {
        product_id: "2",
        product_name: "Product 2",
        quantity: 1,
        price: 20,
        height: "15",
        weight: "10",
        breadth: "4",
        width: "5",
      },
    ],
  },
  consigneeData: {
    consigneeName: "Consignee Name",
    consigneeEmail: "consignee@example.com",
    consigneePhone: "Consignee Phone",
    pickupPincode: "401105",
  },
  shipperData: {
    shipperName: "Shipper Name",
    shipperEmail: "shipper@example.com",
    shipperPhone: "002332523512",
    shipperCity: "Dahisar",
    shipperPincode: "401107",
    shipperState: "Shipper State",
  },
  bookingData: {
    bookingTime: "10:00 am",
    createdDate: "2023-12-11",
    inscanDate: "",
    manifestDate: "",
    serviceCode: "",
    paymentMode: "prepaid",
  },
  height: "15",
  weight: "10",
  breadth: "4",
  payment_method: "Prepaid",
  uid: "user1",
  orderData: {},
};
const shipRocketBookingIntegration = async (data) => {
  try {
    functions.logger.info("\n\nData: ", data + "\n\n");
    const Data = {
      order_id: data.order_id,
      order_date: data.bookingData.createdDate,
      pickup_location: "Primary",
      channel_id: "",
      comment: "Reseller: M/s Goku",
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

    functions.logger.info("Data: ", Data);
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
            functions.logger.error("\n\nResponse Error: ", error.response.data);
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
    return response;
  }
  catch (error) {
    functions.logger.error("\n\nError: ", error);
    return error;
  }
};
const routeOfRocket = async (req, res) => {
  try {
    const response = await shipRocketBookingIntegration(data);
    res.status(200).json(response);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = routeOfRocket;
