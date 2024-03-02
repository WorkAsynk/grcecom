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
      const blob = storage.bucket().file(`invoices/${docIds[0]}.pdf`);
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
      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${
          storage.bucket().name
        }/LO/${blob.name}`;
        // Update the document in db to include the invoice URL
        const docRef = db.collection("logisticOrder").doc(docIds[0]);
        await docRef.update({ invoice: publicUrl });
        // Convert the PDF data to a base64 string
        const pdfBase64 = invoiceData.toString("base64");
        res.status(200).send({ url: publicUrl, pdf: pdfBase64 });
      });
      blobStream.end(invoiceData);
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
