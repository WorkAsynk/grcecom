const { createOrder } = require('./order');
const crypto = require('crypto');
require('dotenv').config();
const createOrderRoute = async (req, res) => {
    const { amount, currency, receipt } = req.body;
    
    try {
        const order = await createOrder(amount, currency, receipt);
        res.json(order);

    } catch (err) {
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

module.exports = { createOrderRoute, successRoute, failureRoute };