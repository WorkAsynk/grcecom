const{ db }= require('../controller/db');

const deletePickupRequest = async (req, res) => {
    try {
        const { uid } = req.body;
        const docRef = db.collection('pickUpRequest').where('uid', '==', uid);
        const snapshot = await docRef.get();
        if (snapshot.empty) {
            res.status(404).send('No document found with the provided uid');
            return;
        }
        snapshot.forEach(doc => {
            db.collection('pickUpRequest').doc(doc.id).delete();
        });
        res.status(200).send('Document successfully deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = deletePickupRequest;