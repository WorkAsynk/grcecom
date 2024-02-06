/**
 * @param {string} awbNumber - The AWB number associated with the order.
 * @param {object} cosigneeData - The data of the consignee.
 * @param {object} destinationData - The data of the destination.
 * @return {string} - The generated HTML template.
 */
const generateEcomTemplate = (awbNumber, cosigneeData, destinationData) => {
  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        padding: 20px;
        text-align: center;
      }

      .container {
        background-color: #ffffff;
        border-radius: 10px;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #cccccc;
        text-align: left;
      }

      h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
        font-weight: 600; /* Add some weight to the heading */
      }

      p {
        color: #666;
        margin-bottom: 10px;
        line-height: 1.5;
      }

      .highlight {
        font-weight: bold;
        color: #ff6600;
      }

      .info {
        background-color: #eef2f7;
        border: 1px solid #d1d1d1;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
      }

      .awb-number { /* Define a specific class for AWB number */
        margin-bottom: 20px; /* Add spacing for better readability */
      }

      table { /* Table for cleaner layout */
        width: 100%;
        border-collapse: collapse;
      }

      td, th {
        padding: 8px;
        border: 1px solid #d1d1d1;
        text-align: left;
      }

      th {
        background-color: #f2f2f2;
        font-weight: 600;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello ${cosigneeData.name}!</h1>
      <p>Your ECOM order has been confirmed</p>

      <div class="info">
        <p>Company ${cosigneeData.consigneeCompanyName}</p>
        <table>
          <tr>
            <th>Consignee Pickup Location:</th>
            <td>${cosigneeData.pickupLocation}</td>
          </tr>
          <tr>
            <th>Consignee Pickup Pincode</th>
            <td>${cosigneeData.pickupPincode}</td>
          </tr>
          <tr>
            <th>Consignee Code</th>
            <td>${cosigneeData.consigneeCode}</td>
          </tr>
          <tr>
            <th>AWB Number</th>
            <td class="highlight awb-number">${awbNumber}</td>
          </tr>
          <tr>
            <th>Destination</th>
            <td>${destinationData.destinationCity},
            ${destinationData.destinationCode}</td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>


    `;
};

module.exports = generateEcomTemplate;
