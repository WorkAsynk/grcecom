/**
 * @module sendJoinInvoice
 * @requires module:splitInvoice
 * @requires module:db
 * @requires module:puppeteer
 */

const { header, footer, style, bodyFunction } = require("./splitInvoice");
const { db } = require("./db");
const puppeteer = require("puppeteer");
/**
 * Generates HTML for child invoices.
 *
 * @async
 * @param {Object} Data - The data object.
 * @param {Object} Data.orderData - The order data.
 * @param {Object[]} Data.orderData.boxes - The boxes in the order.
 * @return {string} The HTML for the child invoices.
 */
const child = async (Data) => {
  let childInvoices = "";

  for (const box of Data.orderData.boxes) {
    childInvoices += `<div style="page-break-after: always;">${bodyFunction(
        box,
    )}</div>`;
  }

  return childInvoices;
};

/**
 * Sends a joined invoice as a PDF.
 *
 * @async
 * @function sendJoinInvoice
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.uid - The UID of the user.
 * @param {string} req.body.collection - The collection to get documents from.
 * @param {Object} res - The response object.
 * @return {void}
 */
const sendJoinInvoice = async (req, res) => {
  try {
    const { uid, collection } = req.body;
    const docSnap = await db
        .collection(collection)
        .where("uid", "==", uid)
        .get();

    if (!docSnap.empty) {
      const documents = [];
      docSnap.forEach((doc) => {
        documents.push(doc.data());
      });

      let masterInvoice = header + style;
      documents.forEach((document) => {
        masterInvoice += bodyFunction(document.orderData) + child(document);
      });
      masterInvoice += footer;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(masterInvoice);
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      await browser.close();

      res.contentType("application/pdf");
      res.send(pdf);
    }
    else {
      res
          .status(404)
          .json({ message: "No documents found for the provided uid" });
    }
  }
  catch (error) {
    console.error(error);
    res
        .status(500)
        .json({ message: "An error occurred while generating the invoice" });
  }
};

module.exports = sendJoinInvoice;
