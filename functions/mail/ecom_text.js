/**
 * Generates the ECOM template text.
 *
 * @param {string} awbNumber - The AWB number.
 * @param {object} cosigneeData - The consignee data.
 * @param {object} destinationData - The destination data.
 * @return {string} The generated ECOM template text.
 */

const generateEcomTemplateText = (awbNumber, cosigneeData, destinationData) => {
  return `
    Hello ${cosigneeData.name}!

    Your ECOM order has been confirmed

    Consignee company: ${cosigneeData.consigneeCompanyName}
    Consignee pickupLocation: ${cosigneeData.pickupLocation}
    Consignee pickupPincode: ${cosigneeData.pickupPincode}
    Consignee consigneeCode: ${cosigneeData.consigneeCode}
    AWB Number: ${awbNumber}
    Destination:
    ${destinationData.destinationCity}, ${destinationData.destinationCode}
    `;
};

module.exports = generateEcomTemplateText;
