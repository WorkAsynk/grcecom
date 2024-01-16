const ViewStatus = require("./viewStatus.js");
const Booking = require("./booking.js");
const RateCalculator = require("./ratecalculator.js");
const getUser = require("./get_user.js");
const deleteDocument = require("./delete_document.js");
const updateData = require("./update_data.js");
const send_invoice = require("./send_invoice.js");
const BarCode = require("./bar_code.js");

module.exports = {
    ViewStatus,
    Booking,
    RateCalculator,
    getUser,
    deleteDocument,
    updateData,
    send_invoice,
    BarCode
    };
