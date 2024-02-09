const ViewStatus = require("./viewStatus.js");
const Booking = require("./booking.js");
const RateCalculator = require("./ratecalculator.js");
const getUser = require("./get_user.js");
const deleteDocument = require("./delete_document.js");
const updateData = require("./update_data.js");
const sendInvoice = require("./send_invoice.js");
const BarCode = require("./bar_code.js");
const routeOfRocket = require("./integrate_rocket.js");
const trackOrder = require("./trackOrder.js");
const shipRocketTrack = require("./trackShipRocket.js");
const updateShipRocketData = require("./updateShipRocket.js");
const generateAndUpdateAWB = require("./generateAWB.js");
// eslint-disable-next-line new-cap
const Router = require("express").Router();

Router.post("/view_status", ViewStatus);
Router.post("/booking", Booking);
Router.post("/rate_calculator", RateCalculator);
Router.post("/get_user", getUser);
Router.post("/delete_document", deleteDocument);
Router.post("/update_data", updateData);
Router.post("/send_invoice", sendInvoice);
Router.post("/bar_code", BarCode);
Router.get("/rocket", routeOfRocket);
Router.post("/track_order", trackOrder);
Router.post("/track_shiprocket", shipRocketTrack);
Router.post("/update/ship", updateShipRocketData);
Router.post("/generate/awb", generateAndUpdateAWB);
module.exports = Router;
