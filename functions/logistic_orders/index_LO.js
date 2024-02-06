const loBooking = require("./LO_booking.js");
const loinvoice = require("./LO_invoice.js");
const loGetUser = require("./LO_get_user.js");
const loDeleteDocument = require("./LO_delete_document.js");
const loUpdateData = require("./LO_update_data.js");
const lobarcode = require("./LO_barcode.js");
const orderStatus = require("./track_api.js");
// eslint-disable-next-line new-cap
const router = require("express").Router();

router.post("/booking", loBooking);
router.post("/invoice", loinvoice);
router.post("/get_user", loGetUser);
router.post("/delete_document", loDeleteDocument);
router.post("/update_data", loUpdateData);
router.post("/bar_code", lobarcode);
router.post("/order/status", orderStatus);
module.exports = router;
