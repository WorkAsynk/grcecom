const barCodeCourier = require("./bar_code_courier");
const bookingCourier = require("./booking_courier");
const deleteCourier = require("./delete_courier");
const getDocumentCourier = require("./get_document_courier");
const invoiceCourier = require("./invoice_courier");
const updateCourier = require("./update_courier");
// eslint-disable-next-line new-cap
const router = require("express").Router();

router.post("/bar_code", barCodeCourier);
router.post("/booking", bookingCourier);
router.post("/delete", deleteCourier);
router.post("/get_document", getDocumentCourier);
router.post("/invoice", invoiceCourier);
router.post("/update", updateCourier);

module.exports = router;
