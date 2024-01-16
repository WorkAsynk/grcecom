const puppeteer = require('puppeteer');

async function generateInvoice(data) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const itemsHtml = Array.isArray(data.freightData.productList) ? data.freightData.productList.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.height}</td>
            <td>${product.width}</td>
            <td>${product.weight}</td>
        </tr>
`).join('') : '';
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
                <h1>Invoice for order ${data.orderID}</h1>
                <p><strong>Order Status: </strong> ${data.ordersStatus}</p>
                <h3>Invoice Number</h3>
                <h4 style='background: powderblue'>AWB number: ${data.awbNumber}</h4>
<table style='width: 100%; border-collapse: collapse;'>
  <tr>
    <td style='width: 50%; vertical-align: top;'>
      <h3>Sent By</h3>
      <p> Company Name: ${data.shipperData.shipperCompanyName}</p>
        <p>Cosignee Name: ${data.consigneeData.consigneeName}</p>
        <p>Cosignee Code:  ${data.consigneeData.consigneeCode}</p>
      <p>City: ${data.consigneeData.pickupLocation}</p>

      
    </td>
    <td style='width: 50%; vertical-align: top;'>
      <h3>Sent To</h3>
      <p>Destination City: ${data.destinationData.destinationCity}</p>
      <p>Destination Code ${data.destinationData.destinationCode}</p>
      <p>Destination Location: ${data.destinationData.destinationLocation}</p>
    </td>
  </tr>
</table>

              <div style='text-align: center'>

            
                <h3>Carrier: <img src= 'https://logos-world.net/wp-content/uploads/2020/08/DHL-Logo.png' height='30' /></h3>

                </div>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Height</th>
                        <th>Width</th>
                        <th>Weight</th>
                    </tr>
                    ${itemsHtml}
                 
                </table>
                <p><strong>Sub Total Value </strong>: ${data.totalPrice} ₹</p>
                <p><strong>Number of products:</strong> ${data.freightData.totalNumberofProducts}</p>   
                <p><strong>Total Weight:</strong> ${data.weight} kg</p>
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
    const pdf = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdf;
}

module.exports = generateInvoice;