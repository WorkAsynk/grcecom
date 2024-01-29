const nodemailer = require("nodemailer");
const generateEcomTemplateHtml = require("./ecom_html");
const generateEcomTemplateText = require("./ecom_text");

/**
 * Sends an email using the configured transporter and provided email options.
 * @async
 * @function sendEmail
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email subject.
 * @param {Object} awbNumber - The AWB number.
 * @param {Object} cosigneeData - The cosignee data.
 * @param {Object} destinationData - The destination data.
 * @return {Promise<void>}
 */
async function sendEmail(
    to,
    subject,
    awbNumber,
    cosigneeData,
    destinationData,
) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // replace with your email
      pass: process.env.PASSWORD, // replace with your password
    },
  });

  // Generate email bodies
  const text = generateEcomTemplateText(
      awbNumber,
      cosigneeData,
      destinationData,
  );
  const html = generateEcomTemplateHtml(
      awbNumber,
      cosigneeData,
      destinationData,
  );

  // Email options
  const mailOptions = {
    from: process.env.EMAIL, // sender
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
