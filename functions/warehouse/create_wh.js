const {firestore}= require('../controller/CRUD');
const create_WearHouse = (data) => {
    return new Promise((resolve, reject) => {
        firestore.collection('warehouse').add(data).then(doc => {
            resolve(doc.id);
        }).catch(err => {
            reject(err);
        })
    })
}