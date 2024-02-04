const { db } = require("./db.js");

async function findData(collectionName, fieldName, fieldValue) {
  const docSnap = await db
      .collection(collectionName)
      .where(fieldName, "==", fieldValue)
      .get();

  if (!docSnap.empty) {
    let result;
    docSnap.forEach((doc) => {
      result = doc.data();
    });
    return result;
  }
  else {
    console.log("No such document!");
    return null;
  }
}

module.exports = findData;
