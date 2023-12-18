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
module.exports = getDocuments;