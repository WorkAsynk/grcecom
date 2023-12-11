const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const ViewStatus = require("./routes/viewStatus.js");
const Booking = require("./routes/booking.js");
const RateCalculator = require("./routes/ratecalculator.js");
const getUser = require("./routes/get_user.js");
app.use(express.json());
app.use(cors({origin: true}));

// const db = require("./controller/db.js");

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/api/booking", Booking);
app.post("/api/rate_calculator", RateCalculator);
app.post("/api/view_status", ViewStatus);
app.post("/api/get_user", getUser);
exports.app = functions.https.onRequest(app);
// firebase serve --only functions
