const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const index_LO = require("./logistic_orders/index_LO.js");
const index_routes = require("./routes/index_routes.js");
const Booking_WareHouse = require("./warehouse/booking_wh.js");
const AuthController = require("./auth/auth_controller.js");
const updateUserData = require("./users/update_user_data.js");
const main_pr = require("./pickup_request/main_pr.js");
const paymentRoutes = require('./payment/paymentRoutes');

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
app.post("/api/booking", index_routes.Booking);
app.post("/api/rate_calculator", index_routes.RateCalculator);
app.post("/api/view_status",AuthController.authenticateToken, index_routes.ViewStatus);
app.post("/api/get_user", index_routes.getUser);
app.post("/api/delete_document", index_routes.deleteDocument);
app.post("/api/update_data", index_routes.updateData);
app.post("/api/send_invoice", index_routes.send_invoice);
app.post("/api/bar_code", index_routes.BarCode);
/***** logisticOrder  ******/
app.post("/api/LO/booking", index_LO.LOBooking);
app.post("/api/LO/invoice", index_LO.LO_invoice);
app.post("/api/LO/get_user", index_LO.LO_get_user);
app.post("/api/LO/delete_document", index_LO.LO_delete_document);
app.post("/api/LO/update_data", index_LO.LO_update_data);
app.post("/api/LO/bar_code", index_LO.LO_barcode);
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