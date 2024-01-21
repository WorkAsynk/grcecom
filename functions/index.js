const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const LO_Routes = require("./logistic_orders/index_LO.js");
const ECOM_Routes= require("./routes/index_routes.js");
const Booking_WareHouse = require("./warehouse/booking_wh.js");
const Auth_Routes = require("./auth/index_auth.js");
const index_pr = require("./pickup_request/index_pr.js");
const authenticateToken = require("./middleware/authenticateToken.js");
const paymentRoutes = require('./payment/paymentRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/ecom_order", ECOM_Routes);
app.use("/api/logistic_order", LO_Routes);
app.post("/api/warehouse/booking", Booking_WareHouse);
app.use("/api/pickup_request", index_pr);
app.use("/api/user", Auth_Routes);
app.post('/api/payment/order/create', authenticateToken, paymentRoutes.createOrderRoute);
app.post('/api/payment/order/success', authenticateToken, paymentRoutes.successRoute);
app.post('/api/payment/order/failure', authenticateToken, paymentRoutes.failureRoute);
exports.app = functions.https.onRequest(app);


// firebase serve --only functions