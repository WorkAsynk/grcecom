/* eslint-disable camelcase */
const createOrder = require("./LO_create_order");
const manifest = require("./handleManifest");
const { db } = require("../controller/db");
const loBooking = async (req, res) => {
  try {
    const {
      ident,
      pickup_location,
      drop_off_location,
      return_address,
      d_mode,
      amount,
      payment_mode,
      rov_insurance,
      invoices,
      weight,
      suborders,
      dimensions,
      consignee_gst_tin,
      seller_gst_tin,
      cb,
    } = req.body;

    const lrno = "LRNO" + Math.floor(Math.random() * 1000000000);
    if (!lrno) {
      return res.status(500).send("Failed to generate order ID.");
    }
    const postData = {
      ident: ident,
      pickup_location: pickup_location,
      drop_off_location: drop_off_location,
      return_address: return_address,
      d_mode: d_mode,
      amount: amount,
      payment_mode: payment_mode,
      rov_insurance: rov_insurance,
      invoices: invoices,
      weight: weight,
      suborders: suborders,
      dimensions: dimensions,
      consignee_gst_tin: consignee_gst_tin,
      seller_gst_tin: seller_gst_tin,
      cb: cb,
    };
    const order = await createOrder(lrno, postData);

    if (!order) {
      return res.status(500).send("Failed to create order.");
    }
    const manifestData = await manifest.create(postData);
    if (!manifestData || !manifestData.job_id) {
      return res.status(500).send("Failed to create manifest.");
    }

    const manifestByID = await manifest.getByJobID(manifestData.job_id);
    if (
      !manifestByID ||
      !manifestByID.status.value.waybills ||
      !manifestByID.status.value.lrnum
    ) {
      return res.status(500).send("Failed to get manifest.");
    }
    const snapshot = await db
        .collection("logisticOrder")
        .where("lrno", "==", lrno)
        .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
    const docRef = db.collection("logisticOrder").doc(order.uid);
    await docRef.update({
      "manifest.waybills": manifestByID.status.value.waybills,
      "manifest.lrnum": manifestByID.status.value.lrnum,
    });

    res.status(200).send(order);
  }
  catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("An unexpected error occurred.");
  }
};
module.exports = loBooking;
// const sendMail = require("../mail/send_mail");
// try {
//   await sendMail(
//       orderData.email,
//       "Order Confirmation",
//       lrno,
//       consigneeData,
//       shippingData,
//       pickupData,
//   );
// }
// catch (err) {
//   console.log(err);
// }
