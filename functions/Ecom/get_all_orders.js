const findData = require("../controller/find_data.js");
const getAllOrders = async (req, res) => {
  try {
    const {
      orderID,
    } = req.body;
    const data= await findData("ecomOrder", "orderID", orderID);
    const productList= data.freightData.productList;
    res.status(200).json({ productList });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = getAllOrders;
