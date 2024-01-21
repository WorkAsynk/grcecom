const LOBooking = require("./LO_booking.js");
const LO_invoice = require("./LO_invoice.js");
const LO_get_user = require("./LO_get_user.js");
const LO_delete_document = require("./LO_delete_document.js");
const LO_update_data = require("./LO_update_data.js");
const LO_barcode = require("./LO_barcode.js");

const Router = require("express").Router();

Router.post("/booking", LOBooking);
Router.post("/invoice", LO_invoice);
Router.post("/get_user", LO_get_user);
Router.post("/delete_document", LO_delete_document);
Router.post("/update_data", LO_update_data);
Router.post("/bar_code", LO_barcode);

module.exports = Router;