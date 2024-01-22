const bwipjs = require("bwip-js");
const { db } = require("../controller/db.js");
const { storage } = require("../controller/db.js");
const barCodeCourier = async (req, res) => {
  try {
    const { uid } = req.body;
    const docSnap = await db
        .collection("courier")
        .where("uid", "==", uid)
        .get();
    if (!docSnap.empty) {
      const documents = [];
      const docIds = [];
      docSnap.forEach((doc) => {
        documents.push(doc.data());
        docIds.push(doc.id);
      });
      const awbnumber = documents[0].awbNumber;

      bwipjs.toBuffer(
          {
            bcid: "code128", // Barcode type
            text: awbnumber, // Text to encode
            scale: 3, // 3x scaling factor
            height: 10, // Bar height, in millimeters
            includetext: true, // Show human-readable text
            textxalign: "center",
          },
          async (err, png) => {
            if (err) {
              console.log(err);
              res
                  .status(500)
                  .json({
                    error: "Failed to generate barcode",
                    message: err.message,
                  });
            }
            else {
            // Create a new blob in the bucket and upload the file data
              const blob = storage
                  .bucket()
                  .file(`barcodes/courier/${docIds[0]}.png`);
              const blobStream = blob.createWriteStream({
                metadata: {
                  contentType: "image/png",
                },
              });
              blobStream.on("error", (err) => {
                console.error(err);
                res
                    .status(500)
                    // eslint-disable-next-line max-len
                    .json({ error: "Failed to upload file", message: err.message });
              });
              blobStream.on("finish", async () => {
                const publicUrl = `https://storage.googleapis.com/${
                  storage.bucket().name
                }/${blob.name}`;
                // Update the document in db to include the barcode URL
                const docRef = db.collection("courier").doc(docIds[0]);
                await docRef.update({ barcode: publicUrl });
                res.status(200).send({ url: publicUrl });
              });
              blobStream.end(png);
            }
          },
      );
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

module.exports = barCodeCourier;
