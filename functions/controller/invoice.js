const PDFDocument = require('pdfkit');
const fs = require('fs');
const { PassThrough } = require('stream');

function generateInvoice(data) {
    const doc = new PDFDocument();
    const pdfStream = doc.pipe(new PassThrough());

    // Add invoice data to the PDF
    doc.text(`Invoice for order ${data.orderID}`, 50, 50);
    doc.text(`AWB Number: ${data.awbNumber}`, 50, 100);
    let yPosition = 150;
    Object.entries(data.shipperData).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 50, yPosition);
        yPosition += 50;
    });

    Object.entries(data.destinationData).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 50, yPosition);
        yPosition += 50;
    });
    //*** Add more data here ***//

    doc.end();

    return new Promise((resolve, reject) => {
        const chunks = [];
        pdfStream.on('data', (chunk) => chunks.push(chunk));
        pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
        pdfStream.on('error', reject);
    });
}

module.exports = generateInvoice;