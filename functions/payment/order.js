const instance = require('./instance');

const createOrder = async (amount, currency, receipt) => {
    const options = {
        amount,  // amount in smallest currency unit
        currency,
        receipt
    };
    const order = await instance.orders.create(options);
    return order;
};

module.exports = { createOrder };