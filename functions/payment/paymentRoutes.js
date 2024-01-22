const { createOrder } = require('./order');
const crypto = require('crypto');
require('dotenv').config();
const findData = require('../controller/find_data');
const {saveUser} = require('../controller/CRUD');
const Router = require("express").Router();

const createOrderRoute = async (req, res) => {
    const { amount, currency, receipt } = req.body;

    try {
        const order = await createOrder(amount, currency, receipt);
        const userUID = req.user.uid;
        
        const user = await findData('users', 'userUID', userUID);
        console.log("Retrieved from database: " + user.walletBalance); // Add this line

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('Before: '+ user.walletBalance);
        user.walletBalance = Number(user.walletBalance);
        console.log("Before: " + user.walletBalance);
        console.log("Amount: " + amount);
        user.walletBalance += Number(amount) / 100;
        console.log("After: " + user.walletBalance);
        user.walletBalance = user.walletBalance.toString();

        await saveUser(user, userUID);
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating order' });
    }
};
const successRoute = (req, res) => {
    const secret = process.env.KEY_SECRET;
    const { orderCreationId, razorpayPaymentId, razorpaySignature } = req.body;
    const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderCreationId + '|' + razorpayPaymentId)
        .digest('hex');
    if (generatedSignature === razorpaySignature) {
        res.status(200).json({ status: 'success' });
    } else {
        res.status(402).json({ status: 'failure' });
    }
};

const failureRoute = (req, res) => {
    res.status(400).json({ status: 'failed' });
};

Router.post("/create", createOrderRoute);
Router.post("/success", successRoute);
Router.post("/failure", failureRoute);

module.exports = Router;