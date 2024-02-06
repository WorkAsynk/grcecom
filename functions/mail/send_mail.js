const mailController = require("./mail_controller");
// eslint-disable-next-line new-cap
const router = require("express").Router();
const sendMail = async (req, res) => {
  const { to, subject, awbNumber, cosigneeData, destinationData } = req.body;
  try {
    await mailController(to, subject, awbNumber, cosigneeData, destinationData);
    res.status(200).send("Email sent successfully");
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
};
router.post("/send-email", sendMail);
module.exports = router;
