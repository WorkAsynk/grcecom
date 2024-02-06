const { db } = require("../controller/db");

const createPickUp = (data) => {
  return new Promise((resolve, reject) => {
    db.collection("pickUpAddress")
        .add(data)
        .then((doc) => {
          resolve(doc.id);
        })
        .catch((err) => {
          reject(err);
        });
  });
};

module.exports = createPickUp;
