const {firestore} = require('../controller/CRUD.js');

async function getDocuments(collectionName, fieldName, fieldValue) {
    const docSnap = await firestore.collection(collectionName).where(fieldName, "==", fieldValue).get();
  
    if (!docSnap.empty) {
        let documents = [];
        docSnap.forEach(doc => {
            documents.push(doc.data());
        });
        return documents;
    } else {
        console.log("No such document!");
        return [];
    }
}

const getUser = async (req, res) => {
    try {
        const {uid} = req.body;
        const documents = await getDocuments("ecomOrder", 'uid', uid);
        res.status(200).json({ order_count: documents.length, documents });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retrieve data", message: error.message });
    }
}

module.exports = getUser;