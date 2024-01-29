const express = require("express");
const sendEmail = require("./send_mail");
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(express.json());

router.post("/send-email", async (req, res) => {
  const { to, subject, awbNumber, cosigneeData, destinationData } = req.body;

  try {
    await sendEmail(to, subject, awbNumber, cosigneeData, destinationData);
    res.status(200).send("Email sent successfully");
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
});

const port = process.env.PORT || 3000;
router.listen(port, () => console.log(`Server running on port ${port}`));
