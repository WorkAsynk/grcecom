/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const { db } = require("./db.js");

async function createData(collectionName, documentName, data) {
  await db.collection(collectionName).doc(documentName).set(data);
}

async function readData(collectionName, documentName) {
  const docSnap = await db.collection(collectionName).doc(documentName).get();

  if (docSnap.exists) {
    console.log(docSnap.data());
  }
  else {
    console.log("No such document!");
  }
}

async function updateData(collectionName, documentName, updatedData) {
  await db.collection(collectionName).doc(documentName).update(updatedData);
}

async function deleteData(collectionName, documentName) {
  await db.collection(collectionName).doc(documentName).delete();
}
async function saveUser(user, userUID) {
  await db.collection("users").doc(userUID).set(user);
}
async function updateDataAccordingToField(collectionName, fieldName, fieldValue, updateField, updateValue) {
  const snapshot = await db.collection(collectionName).where(fieldName, "==", fieldValue).get();
  snapshot.forEach((doc) => {
    doc.ref.update({ [updateField]: updateValue });
  });
}
module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
  saveUser,
  updateDataAccordingToField,
};
