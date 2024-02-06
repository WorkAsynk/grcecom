// Import the db instance from the CRUD controller
const { db } = require("../controller/db.js");

const updateUserData = async (req, res) => {
  try {
    // Destructure uid and Data from the request body
    const { uid, Data } = req.body;

    // Get a reference to the document with the provided uid
    const docRef = db.collection("users").doc(uid);

    // Get the data of the document
    const doc = await docRef.get();

    // Check if the document exists
    if (doc.exists) {
      const docData = doc.data();

      for (const key in Data) {
        // Check if the key exists in the document data
        if (!(key in docData)) {
          // If the key does not exist, throw an error
          throw new Error(`The field ${key} does not exist in the document.`);
        }
      }

      // Update the document with the Data object
      await docRef.update(Data);

      // Send a success response
      res.status(200).json({ message: "Successfully updated document" });
    }
    else {
      // If no matching document is found, send a 404 response
      res
          .status(404)
          .json({ error: "No document found with the provided uid" });
    }
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to update document", message: error.message });
  }
};

module.exports = updateUserData;
