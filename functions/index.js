const functions = require("firebase-functions");
const express = require("express");
const app = express();

const loRoutes = require("./logistic_orders/index_LO.js");
const ecomRoutes = require("./routes/index_routes.js");
const bookingWareHouse = require("./warehouse/booking_wh.js");
const authRoutes = require("./auth/index_auth.js");
const pickUpRequest = require("./pickup_request/index_pr.js");
const authenticateToken = require("./middleware/authenticateToken.js");
const paymentRoutes = require("./payment/paymentRoutes");
const courier = require("./courier/index_courier");

const setupMiddleware = require("./middleware/index_middleware");
setupMiddleware(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/ecom_order", ecomRoutes);
app.use("/api/logistic_order", loRoutes);
app.post("/api/warehouse/booking", bookingWareHouse);
app.use("/api/pickup_request", pickUpRequest);
app.use("/api/user", authRoutes);
app.use("/api/order", authenticateToken, paymentRoutes);
app.use("/api/courier", courier);
exports.app = functions.https.onRequest(app);

// firebase serve --only functions
