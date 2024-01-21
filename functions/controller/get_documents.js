const {db}= require('./db.js');
const getDocuments = async (collection, field, value) => {
    try {
        const documents = await db.collection(collection).where(field, '==', value).get();
        const docs = [];
        documents.forEach(doc => {
            docs.push(doc.data());
        });
        console.log("docs" + docs);
        return docs;
    }
    catch (error) {
        console.log(error);
        throw error;    
    }
}
module.exports = getDocuments;