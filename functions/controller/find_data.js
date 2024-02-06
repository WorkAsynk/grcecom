const { db } = require("./db.js");

/**
 * Finds a document in a Firestore collection based on a specified field & value
 * @param {string} collectionName - The name of the collection to search in.
 * @param {string} fieldName - The name of the field to match against.
 * @param {any} fieldValue - The value to match against the specified field.
 * @return {Promise<object|null>} - A promise that resolves to the
 * or null if no document is found.
 */
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
