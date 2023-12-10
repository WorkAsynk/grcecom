const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const createOrder = require("./routes/create_order.js");
const Test = require("./routes/test.js");
const Booking = require("./routes/booking.js");
const RateCalculator = require("./routes/ratecalculator.js");
app.use(express.json());
app.use(cors({origin: true}));

const db = require('./controller/db.js');

app.get("/test", Test); //to make sure the server is running
app.post("/api/createOrder", createOrder);
app.post("/api/booking", Booking);
app.post("/api/ratecalculator", RateCalculator);

exports.app = functions.https.onRequest(app);
//firebase serve --only functions