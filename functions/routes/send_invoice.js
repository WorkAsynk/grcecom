const firestore = require('../controller/CRUD.js').firestore;
const generateInvoice = require('../controller/Invoice.js')
const sendInvoice = async (req, res) => {
    try {
        const {uid}= req.body;
        const docSnap= await firestore.collection("ecomOrder").where("uid", "==", uid).get();
        if (!docSnap.empty) {
            let documents = [];
            let docIds = [];
            docSnap.forEach(doc => {
                documents.push(doc.data());
                docIds.push(doc.id);
            });
            const invoiceData = await generateInvoice(documents[0]);
            await firestore.collection('ecomOrder').doc(docIds[0]).update({ invoiceData });
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