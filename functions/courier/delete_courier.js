const { db } = require("../controller/db.js");

const deleteDocumentCourier = async (req, res) => {
  try {
    const { orderID } = req.body;
    const snapshot = await db
        .collection("courier")
        .where("orderID", "==", orderID)
        .get();

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
      res.status(200).json({ message: "Successfully deleted document" });
    }
    else {
      res
          .status(404)
          .json({ error: "No document found with the provided orderID" });
    }
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to delete document", message: error.message });
  }
};
module.exports = deleteDocumentCourier;
