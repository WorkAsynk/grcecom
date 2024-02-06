const { messaging } = require("../controller/db");

const sendNotification = async (req, res) => {
  const { FCMToken, title, body } = req.body;

  if (!FCMToken) {
    return res.status(400).json({
      message: "Missing FCMToken",
    });
  }

  if (!title) {
    return res.status(400).json({
      message: "Missing title",
    });
  }

  if (!body) {
    return res.status(400).json({
      message: "Missing body",
    });
  }

  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  messaging
      .sendToDevice(FCMToken, payload)
      .then((response) => {
        return res
            .status(200)
            .json({ message: "Notification sent successfully", response });
      })
      .catch((error) => {
        console.error(`Failed to send notification: ${error}`);
        return res
            .status(500)
            .json({ message: "Failed to send notification", error });
      });
};

module.exports = sendNotification;
