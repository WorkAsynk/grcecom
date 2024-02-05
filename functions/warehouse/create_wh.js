const { db } = require("../controller/db");
const createWareHouse = (data) => {
  return new Promise((resolve, reject) => {
    db.collection("warehouse")
        .add(data)
        .then((doc) => {
          resolve(doc.id);
        })
        .catch((err) => {
          reject(err);
        });
  });
};
module.exports = createWareHouse;
