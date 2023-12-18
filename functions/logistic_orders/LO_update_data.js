// Import the firestore instance from the CRUD controller
const {firestore} = require('../controller/CRUD.js');

// Define the async function to update data
const updateData = async (req, res) => {   
    try {
        // Destructure lrno and Data from the request body
        const {lrno, Data} = req.body;

        // Query the 'ecomOrder' collection for documents where the 'lrno' field is equal to the provided lrno
        const snapshot = await firestore.collection("logisticOrder").where('lrno', '==', lrno).get();

        // Check if the snapshot is not empty, i.e., if there are any matching documents
        if (!snapshot.empty) {
            let docRef;
            snapshot.forEach(doc => {
                // Get the reference of the document
                docRef = doc.ref;
            });

            // Get the data of the document
            const docData = (await docRef.get()).data();

            for (let key in Data) {
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
        } else {
            // If no matching document is found, send a 404 response
            res.status(404).json({ error: "No document found with the provided lrno" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update document", message: error.message });
    }
}

module.exports = updateData;