const {firestore}= require('../controller/CRUD');
const createPickUp = (data) => {
    return new Promise((resolve, reject) => {
        firestore.collection('pickup_address').add(data).then(doc => {
            resolve(doc.id);
        }).catch(err => {
            reject(err);
        })
    })
}
module.exports = createPickUp;