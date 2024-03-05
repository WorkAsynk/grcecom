const axios = require("axios");
const baseURL= "https://btob-api-dev.delhivery.com/";
// const loginHandler = async (username, password) => {
//     const data = {
//         username: username,
//         password: password
//     };
//     const url = '${baseURL}ums/login/';
//     const response = await axios.post(url, data, {
//         headers: {
//             'Content-Type': 'application/json'
//         },
// });
//     console.log(`This is response data: ${response.data}`);
//     return response.data.jwt;
// }

const BookingHandler = async (Data) => {
  const url = `${baseURL}v3/manifest`;
  const jwt = process.env.DELIVERY_TOKEN;
  let response;
  try {
    response = await axios.post(url, Data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
    });
  }
  catch (error) {
    console.error(`Error in BookingHandler: ${error}`);
    throw error;
  }
  if (response.data) {
    return response.data;
  }
  // eslint-disable-next-line max-len
  return new Error("Failed to book order in delhivery api in delivery api handler");
};
const SaveForwardingNumber = async (jobId)=>{
  const url = `${baseURL}v3/manifest?job_id=` + jobId;
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DELIVERY_TOKEN}`,
      },
    });
  }
  catch (error) {
    console.error(`Error in SaveForwardingNumber: ${error}`);
  }
  if (response.data) {
    console.log(`This is response data: ${JSON.stringify(response.data)}`);
    return response.data;
  }
};

module.exports = {
  BookingHandler,
  SaveForwardingNumber,
};

