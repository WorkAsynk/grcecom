const CRUD = require('../controller/CRUD.js');
const db = require('../controller/db.js');

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
function OrdersStatus() {
  const status = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];
  return status[0];
}
function ShipmentPrice() {
  const price = [10000, 20000, 30000, 40000];
  return price[0];
}
const Booking = async (req, res) => {
  try {
    const {
      originCode,
      forwardingNumber,
      destinationCode,
      destinationCity,
      productCode,
      invoiceDate,
      bookingTime,
      inscanDate,
      manifestDate,
      serviceCode,
      createdDate,
      shipperCode,
      shipperName,
      shipperCity,
      shipperContact,
      shipperPincode,
      consigneeCode,
      consigneeName,
      consigneeContact,
      calendarYear,
      shipperCompanyName,
      consigneeCompanyName,
      customerType,
      fedexReference,
      voidDate,
      forwarderCode,
      insuranceType,
      runsheetNO,
      maxFrieght,
      minFrieght,
      maxWeight,
      minWeight,
      pickupLocation,
      deliveryLocation,
      width,
      height,
    } = req.body;

    const data = {
      originCode,
      forwardingNumber,
      destinationCode,
      destinationCity,
      productCode,
      invoiceDate,
      bookingTime,
      inscanDate,
      manifestDate,
      serviceCode,
      createdDate,
      shipperCode,
      shipperName,
      shipperCity,
      shipperContact,
      shipperPincode,
      consigneeCode,
      consigneeName,
      consigneeContact,
      calendarYear,
      shipperCompanyName,
      consigneeCompanyName,
      customerType,
      fedexReference,
      voidDate,
      forwarderCode,
      insuranceType,
      runsheetNO,
      minFrieght,
      maxFrieght,
      minWeight,
      maxWeight,
      pickupLocation,
      deliveryLocation,
      width,
      height,
    };

    const documentName = generateRandomString(10);
    await CRUD.createData('temp', documentName, data);

    let awbNumber = generateRandomString(10);
    let referenceNumber = generateRandomString(7);
    let ordersStatus = OrdersStatus();
    let shipmentPrice = ShipmentPrice();
    res.status(201).json({
      message: 'Your shipment is booked',
      awbNumber,
      referenceNumber,
      ordersStatus,
      shipmentPrice
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data', message: error.message });
  }
};

module.exports = Booking;