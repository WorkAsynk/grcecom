const sendNotification = require("./messaging_cotroller");
// eslint-disable-next-line new-cap
const router = require("express").Router();

router.post("/send-notification", sendNotification);
module.exports = router;
