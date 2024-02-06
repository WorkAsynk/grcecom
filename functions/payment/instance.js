const Razorpay = require("razorpay");
require("dotenv").config();
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
module.exports = instance;
