const puppeteer = require("puppeteer");
/**
 *@param {object} data
 *@return {Promise<Buffer>} pdf
 */
async function generateInvoiceLO(data) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const itemsHtml = Array.isArray(data.suborders) ?
    data.suborders
        .map(
            (suborder) => `
        <tr>
            <td>${suborder.id}</td>
            <td>${suborder.name}</td>
            <td>${suborder.height}</td>
            <td>${suborder.width}</td>
            <td>${suborder.weight}</td>
        </tr>
`,
        )
        .join("") :
    "";
  // Generate the HTML for the invoice
  const html = `
        <html>
        <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 20px;
          box-sizing: border-box;
          border: 1px solid black;
          padding: 15px;
        }
        
        h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        h2, h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        
        p {
          margin: 5px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f2f2f2;
        }
        
        .signature-date {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        
        .signature-date div {
          align-items: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
        }
        
        .signature-date div p {
          margin-top: 30px;
          border-top: 1px solid black;
          text-align: center;
          width: 200px;
        }
        </style> 
        <body>
        <h1>Invoice</h1>
         <p><strong>Order Status: </strong> ${data.ordersStatus} </p> 
        <table style='width: 100%; border-collapse: collapse;'>
          <tr>
            <td style='width: 50%; vertical-align: top;'>
              <h3>Sent By</h3>
              <p>Company Name: (Shipper Name Not Provided)</p> 
              <p>Address: ${data.return_address.address}</p>
               <p>City: ${data.return_address.city}</p>
              <p>Region: ${data.return_address.region}</p> 
              <p>ZIP: ${data.return_address.zip}</p> 
              <p>Phone: ${data.return_address.phone}</p> 
            </td>
      
            <td style='width: 50%; vertical-align: top;'>
              <h3>Sent To</h3>
              <p>Consignee: ${data.dropoff_location.consignee}</p> 
              <p>Address: ${data.dropoff_location.address}</p> 
              <p>City: ${data.dropoff_location.city}</p>
              <p>Region: ${data.dropoff_location.region}</p> 
              <p>ZIP: ${data.dropoff_location.zip}</p> 
              <p>Phone: ${data.dropoff_location.phone}</p> 
            </td>
          </tr>
        </table>
      
        <div style='text-align: center'>          
            <h3>Carrier: <img src='https://logos-world.net/wp-content/uploads/2020/08/DHL-Logo.png' height='30' /></h3> 
        </div>
      
        <table>
          <tr>
            <th>Suborder ID</th> 
            <th>Description</th> 
            <th>Waybill Number</th>
            <th>Length</th>  
            <th>Width</th> 
            <th>Height</th> 
          </tr> 
         
               ${itemsHtml} 
        </table>
      
        <p><strong>Total Value: </strong>(Invoice Value not Provided)</p> 
        <p><strong>Number of Products:</strong> ${data.suborders.length}</p>  
        <p><strong>Total Weight:</strong> ${data.weight} </p>  
        <div class="signature-date">
          <div>
            <p>Signature</p>
          </div>
          <div>
            <p>Date</p>
          </div>
        </div>
      </body>
      
        </html>
    `;

  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  return pdf;
}

module.exports = generateInvoiceLO;
