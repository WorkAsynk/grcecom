const generateInvoice = require('../controller/invoice');
const {firestore} = require('../controller/CRUD.js');

const sendInvoice = async (req, res) => {
    try {
        const {uid}= req.body;
        const docSnap= await firestore.collection("ecomOrder").where("uid", "==", uid).get();
        if (!docSnap.empty) {
            let documents = [];
            docSnap.forEach(doc => {
                documents.push(doc.data());
            });
            const invoiceData = await generateInvoice(documents[0]);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
            res.send(invoiceData);
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
module.exports = sendInvoice;