const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const ViewStatus = require("./routes/viewStatus.js");
const Booking = require("./routes/booking.js");
const RateCalculator = require("./routes/ratecalculator.js");
const getUser = require("./routes/get_user.js");
const deleteDocument = require("./routes/delete_document.js");
const updateData = require("./routes/update_data.js");
const signUp = require("./routes/sign_up.js");
const send_invoice = require("./routes/send_invoice.js");
const BarCode = require("./routes/bar_code.js");

const LOBooking = require("./logistic_orders/LO_booking.js");
app.use(express.json());
app.use(cors({origin: true}));

// const db = require("./controller/db.js");

app.get("/", (req, res) => {
  res.send("Hello World");
});
/*****  EcomOrder ******/
app.post("/api/booking", Booking);
app.post("/api/rate_calculator", RateCalculator);
app.post("/api/view_status", ViewStatus);
app.post("/api/get_user", getUser);
app.post("/api/delete_document", deleteDocument);
app.post("/api/update_data", updateData);
app.post("/api/send_invoice", send_invoice);
app.post("/api/bar_code", BarCode);
app.post("/api/sign_up", signUp);
app.post("/api/LO_booking", LOBooking);
/***** logisticOrder  ******/
exports.app = functions.https.onRequest(app);
// app.post("/api/LO/invoice", LO_invoice);
// app.post("/api/LO/get_user", LO_get_user);
// app.post("/api/LO/delete_document", LO_delete_document);
// app.post("/api/LO/update_data", LO_update_data);
// app.post("/api/LO/bar_code", LO_barcode);



// firebase serve --only functions
