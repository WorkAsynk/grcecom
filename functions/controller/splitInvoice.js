const header = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
<body>
    `;

const footer = `
</body>
</html>`;

const style = `
<style>
body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.small-text {
    font-size: 12px;
    color: #888;
}

img {
    width: 150px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.card-container table {
    width: 45%;
    /* Reduced width to account for any margins/padding */
    box-sizing: border-box;
    /* Include padding and border in element's total width */
}
</style>`;
const bodyFunction = (myObject) => {
  const body = `
<div class="card-container">
<table>
    <tr>
        <th colspan="2"><img
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/Delhivery_Logo_%282019%29.png" alt="">
        </th>
        <th colspan="2">Order ID: ${myObject.OrderID}</th>
    </tr>
    <tr>
        <td colspan="2">MASTER: ${myObject.Dontknowthis}
            <br>
            LRNO: ${myObject.LRNO}
        </td>
        <td colspan="2" class="small-text">(isMaster)?'Master':'Child'</td>
    </tr>
    <tr>
        <td>BOX: ${myObject.boxCount}</td>
        <td></td>
        <td>28003 AGR/JHR ${myObject.DontKnow}</td>
    </tr>
    <tr>
        <td colspan="2">${myObject.consigneeData.consigneeCode}
            <br>
            ${myObject.consigneeData.pickupLocation}
        </td>
        <td>${myObject.awbNumber}</td>
    </tr>
    <tr>
        <td colspan="2">Shipping address:<br>
        {destinationData.destinationLocation}</td>
        <td>MEDICAL DEVICES: {dontKnowThis}</td>
    </tr>
    <tr>
        <td colspan="4">Return address:<br>{consigneeData.pickupLocation}</td>
    </tr>
</table>
`;
  return body;
};
module.exports = {
  header: header,
  footer: footer,
  style: style,
  bodyFunction: bodyFunction,
};
