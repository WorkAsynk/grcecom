const { db } = require("../controller/db");
const create_WareHouse = (data) => {
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
module.exports = create_WareHouse;
