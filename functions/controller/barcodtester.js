const barCodeController = require("./barCodeController");

const barCodeTester = async (req, res) => {
  const { lrno } = req.body;
  const result = await barCodeController(
      "logisticOrder",
      "lrno",
      lrno,
      "orderID",
      "logisticOrder",
  );
  res.status(200).json(result);
};

module.exports = barCodeTester;
