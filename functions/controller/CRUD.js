/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// const db = require("./db.js");
const {Firestore} = require("@google-cloud/firestore");

const firestore = new Firestore();

async function createData(collectionName, documentName, data) {
  await firestore.collection(collectionName).doc(documentName).set(data);
}

async function readData(collectionName, documentName) {
  const docSnap = await firestore.collection(collectionName).doc(documentName).get();

  if (docSnap.exists) {
    console.log(docSnap.data());
  } else {
    console.log("No such document!");
  }
}

async function updateData(collectionName, documentName, updatedData) {
  await firestore.collection(collectionName).doc(documentName).update(updatedData);
}

async function deleteData(collectionName, documentName) {
  await firestore.collection(collectionName).doc(documentName).delete();
}

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
  firestore,
};
