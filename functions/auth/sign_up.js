const Auth = require("./auth");
const { auth } = require("../controller/db");
/**
 * Signs up a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @async
 * @return {Promise<void>}
 */
async function signUp(req, res) {
  try {
    const {
      email,
      password,
      name,
      contactNumber,
      userId,
      partnerType,
      packageType,
      role,
      serviceType,
    } = req.body;
    const walletBalance = 0;
    const userRecord = await Auth.signUp(
        email,
        password,
        name,
        contactNumber,
        role,
        userId,
        partnerType,
        walletBalance,
        packageType,
        serviceType,
    );
    console.log("Successfully created new user:", userRecord.uid);

    // Create a custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Send the response along with the custom token
    res.status(200).json({ message: "User created", customToken: customToken });
  }
  catch (error) {
    console.error("Error creating new user:", error);
    res.status(400).send(error.message);
  }
}
module.exports = signUp;
