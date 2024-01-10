const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const ViewStatus = require("./routes/viewStatus.js");
const Booking = require("./routes/booking.js");
const RateCalculator = require("./routes/ratecalculator.js");
const getUser = require("./routes/get_user.js");
const deleteDocument = require("./routes/delete_document.js");
const updateData = require("./routes/update_data.js");
const send_invoice = require("./routes/send_invoice.js");
const BarCode = require("./routes/bar_code.js");
const Booking_WareHouse = require("./warehouse/booking_wh.js");
const LOBooking = require("./logistic_orders/LO_booking.js");
const LO_invoice = require("./logistic_orders/LO_invoice.js");
const LO_get_user = require("./logistic_orders/LO_get_user.js");
const LO_delete_document = require("./logistic_orders/LO_delete_document.js");
const LO_update_data = require("./logistic_orders/LO_update_data.js");
const LO_barcode = require("./logistic_orders/LO_barcode.js");
const AuthController = require("./auth/auth_controller.js");
const updateUserData = require("./users/update_user_data.js");
const main_pr = require("./pickup_request/main_pr.js");
const paymentRoutes = require('./payment/paymentRoutes');
const { Auth } = require("firebase-admin/auth");

// Parse URL-encoded bodies and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
// const db = require("./controller/db.js");

app.get("/", (req, res) => {
  res.send("Hello World");
});
/*****  EcomOrder ******/
app.post("/api/booking", Booking);
app.post("/api/rate_calculator", RateCalculator);
app.post("/api/view_status",AuthController.authenticateToken, ViewStatus);
app.post("/api/get_user", getUser);
app.post("/api/delete_document", deleteDocument);
app.post("/api/update_data", updateData);
app.post("/api/send_invoice", send_invoice);
app.post("/api/bar_code", BarCode);
/***** logisticOrder  ******/
app.post("/api/LO/booking", LOBooking);
app.post("/api/LO/invoice", LO_invoice);
app.post("/api/LO/get_user", LO_get_user);
app.post("/api/LO/delete_document", LO_delete_document);
app.post("/api/LO/update_data", LO_update_data);
app.post("/api/LO/bar_code", LO_barcode);
/***** Warehouse ******/
app.post("/api/warehouse/booking", Booking_WareHouse);
/***** User ******/
app.post("/api/update_user_data", updateUserData);
/* Pickup Request */
app.post("/api/pick_up_req/create", main_pr.CreateNewPickupRequest);
app.post("/api/pick_up_req/update", main_pr.updatePickupRequest);
app.post("/api/pick_up_req/delete", main_pr.deletePickupRequest);
/***** Auth ******/
app.post("/api/sign_up", AuthController.signUp);
app.post("/api/login", AuthController.login);
app.post("/api/delete_user", AuthController.deleteUser);
app.post("/api/update_password", AuthController.updatePassword);
/* Payment */
app.post('/api/payment/order/create', AuthController.authenticateToken, paymentRoutes.createOrderRoute);
app.post('/api/payment/order/success', AuthController.authenticateToken, paymentRoutes.successRoute);
app.post('/api/payment/order/failure', AuthController.authenticateToken, paymentRoutes.failureRoute);
exports.app = functions.https.onRequest(app);


// firebase serve --only functions
