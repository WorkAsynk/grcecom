const ViewStatus = require("./viewStatus.js");
const Booking = require("./booking.js");
const RateCalculator = require("./ratecalculator.js");
const getUser = require("./get_user.js");
const deleteDocument = require("./delete_document.js");
const updateData = require("./update_data.js");
const send_invoice = require("./send_invoice.js");
const BarCode = require("./bar_code.js");
const Router = require("express").Router();

Router.post("/view_status", ViewStatus);
Router.post("/booking", Booking);
Router.post("/rate_calculator", RateCalculator);
Router.post("/get_user", getUser);
Router.post("/delete_document", deleteDocument);
Router.post("/update_data", updateData);
Router.post("/send_invoice", send_invoice);
Router.post("/bar_code", BarCode);

module.exports = Router;
