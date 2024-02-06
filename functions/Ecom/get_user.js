const getDocuments = require("../controller/get_documents.js");
const getUser = async (req, res) => {
  try {
    const { uid } = req.body;
    const documents = await getDocuments("ecomOrder", "uid", uid);
    res.status(200).json({ order_count: documents.length, documents });
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to retrieve data", message: error.message });
  }
};

module.exports = getUser;
