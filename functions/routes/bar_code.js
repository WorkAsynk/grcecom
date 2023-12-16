const bwipjs = require('bwip-js');
const {firestore} = require('../controller/CRUD.js');

const BarCode = async (req, res) => {
    try {
        const {uid} = req.body;
        const docSnap = await firestore.collection("ecomOrder").where("uid", "==", uid).get();
        if (!docSnap.empty) {
            let documents = [];
            let docIds = [];
            docSnap.forEach(doc => {
                documents.push(doc.data());
                docIds.push(doc.id);
            });
            const awbnumber = documents[0].awbNumber; 

            bwipjs.toBuffer({
                bcid: 'code128', // Barcode type
                text: awbnumber, // Text to encode
                scale: 3,        // 3x scaling factor   
                height: 10,      // Bar height, in millimeters
                includetext: true, // Show human-readable text
                textxalign: 'center', 
            }, async function (err, png) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Failed to generate barcode", message: err.message });
                } else {
                    // Convert the PNG to a base64 string
                    const base64Png = png.toString('base64');
                    // Add the base64 string to the same document in Firestore
                    await firestore.collection('ecomOrder').doc(docIds[0]).update({ barcode: base64Png });
                    res.setHeader('Content-Type', 'image/png');
                    res.send(png);
                }
            });
        } else {
            console.log("No such document!");
            res.status(400).json({ error: "No such document!" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retrieve data", message: error.message });
    }
}

module.exports = BarCode;

module.exports = BarCode;