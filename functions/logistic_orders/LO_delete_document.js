const {firestore} = require('../controller/CRUD.js');

const deleteDocument = async (req, res) => {
    try {
        const {lrno} = req.body;
        const snapshot = await firestore.collection("logisticOrder").where('lrno', '==', lrno).get();

        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                doc.ref.delete();
            });
            res.status(200).json({ message: "Successfully deleted document" });
        } else {
            res.status(404).json({ error: "No document found with the provided lrno" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete document", message: error.message });
    }
}

module.exports = deleteDocument;