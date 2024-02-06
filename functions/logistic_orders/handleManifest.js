const axios = require("axios");

/**
 * Update other API with the provided postData.
 * @param {Object} postData - The data to be sent to the API.
 * @return {Object} - The response from the API.
 */
const manifest = [];
manifest.create = async (postData) => {
  const accessToken = process.env.DELHIVERY_ACCESS_TOKEN;
  const url = "https://btob-api-dev.delhivery.com/v3/manifest";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  };
  const options = {
    method: "post",
    headers: headers,
    data: postData,
  };
  const response = await axios(url, options);
  return response.data;
};
/**
 * Get the manifest ID for a given job ID.
 * @param {string} jobID - The job ID.
 * @return {Object} - The response from the API.
 */
manifest.getByJobID = async (jobID) => {
  const accessToken = process.env.DELHIVERY_ACCESS_TOKEN;
  const url =
    "https://btob-api-dev.delhivery.com/v3/manifest?" + `job_id=${jobID}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  };
  const options = {
    method: "get",
    headers: headers,
  };
  const response = await axios(url, options);
  return response.data;
};

module.exports = manifest;
