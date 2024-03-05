const { db } = require("../controller/db.js");
const generateInvoice = require("./invoice_controller.js");
const { storage } = require("../controller/db.js");
const sendInvoice = async (req, res) => {
  try {
    const { orderID } = req.body;
    const docSnap = await db
        .collection("logisticOrder")
        .where("orderID", "==", orderID)
        .get();
    if (!docSnap.empty) {
      const documents = [];
      const docIds = [];
      docSnap.forEach((doc) => {
        documents.push(doc.data());
        docIds.push(doc.id);
      });
      const invoiceData = await generateInvoice(documents[0]);
      // Create a new blob in the bucket and upload the file data
      const blob = storage.bucket().file(`invoices/LO/${docIds[0]}.pdf`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: "application/pdf",
        },
      });
      blobStream.on("error", (err) => {
        console.error(err);
        res
            .status(500)
            .json({ error: "Failed to upload file", message: err.message });
      });
      blobStream.end(invoiceData); // Write the invoice data to the stream

      blobStream.on("finish", async () => {
        const options = {
          version: "v4",
          action: "read",
          expires: Date.now() + 1000 * 60 * 60, // 1 hour
        };

        // Get a signed URL for the file
        blob.getSignedUrl(options)
            .then((downloadUrl) => {
              const docRef = db.collection("logisticOrder").doc(docIds[0]);
              docRef.update({ invoiceURL: downloadUrl[0] });
              res.status(200).send({ url: downloadUrl[0] });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
      });
    }
    else {
      console.log("No such document!");
      res.status(400).json({ error: "No such document!" });
    }
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to retrieve data", message: error.message });
  }
};
module.exports = sendInvoice;
