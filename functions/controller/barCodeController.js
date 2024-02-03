const bwipJs = require("bwip-js");
const { db, storage } = require("../controller/db.js");
const firebaseLogger = require("firebase-functions").logger;

const barCodeController = async (
    collectionName,
    comparisonField,
    comparisonValue,
    barcodeInputField,
    storageDirectory,
) => {
  /**
   * @param {string} collection - name of the collection
   * @param {string} toCompare - field name to compare
   * @param {string} barCodeInput - field name of the barcode input
   * @param {string} storageDirectory - to store the barcode image
   * @return {object} - returns an object with the barcode image URL
   */
  const documentSnapshot = await db
      .collection(collectionName)
      .where(comparisonField, "==", comparisonValue)
      .get();
  if (!documentSnapshot.empty) {
    return new Promise((resolve, reject) => {
      // input validation
      if (typeof collectionName !== "string") {
        firebaseLogger.error("collectionName should be a string");
        return {
          error: "collectionName should be a string",
        };
      }
      if (typeof comparisonField !== "string") {
        firebaseLogger.error("comparisonField should be a string");
        return {
          error: "comparisonField should be a string",
        };
      }
      if (typeof barcodeInputField !== "string") {
        firebaseLogger.error("barcodeInputField should be a string");
        return {
          error: "barcodeInputField should be a string",
        };
      }
      if (typeof storageDirectory !== "string") {
        firebaseLogger.error("storageDirectory should be a string");
        return {
          error: "storageDirectory should be a string",
        };
      }

      // fetching the document from the collection
      const documentData = [];
      const docIds = [];
      documentSnapshot.forEach((doc) => {
        documentData.push(doc.data());
        docIds.push(doc.id);
      });
      const barcodeInputValue = documentData[0][barcodeInputField];
      bwipJs.toBuffer(
          {
            bcid: "code128",
            text: barcodeInputValue,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: "center",
          },

          async (err, pngData) => {
            if (err) {
              firebaseLogger.error("Failed to generate barcode", err);
              return reject(
                  new Error("Failed to generate barcode: " + err.message),
              );
            }
            else {
            // Create a new blob in the bucket and upload the file data
              const blob = storage
                  .bucket()
                  .file(storageDirectory + "/barcode/" + docIds[0] + ".png");

              const blobStream = blob.createWriteStream({
                metadata: {
                  contentType: "image/pngData",
                },
              });
              blobStream.on("error", (err) => {
                firebaseLogger.error("Failed to upload file", err);
                // eslint-disable-next-line max-len
                return reject(new Error("Failed to upload file: " + err.message));
              });
              blobStream.on("finish", () => {
                firebaseLogger.info("Barcode image uploaded successfully");
              });
              blobStream.end(pngData);
              return resolve({
                url: `https://storage.googleapis.com/${storage.bucket().name}/${
                  blob.name
                }`,
              });
            }
          },
      );
    });
  }
  else {
    firebaseLogger.warn("No documents found for the provided toCompare");
    throw new Error("No documents found for the provided toCompare");
  }
};

module.exports = barCodeController;
