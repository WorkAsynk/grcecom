const { auth } = require("../controller/db");

/**
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The user record.
 * @throws {Error} If an error occurs during sign up.
 */
async function Login(req, res) {
  try {
    // Verify the ID token
    const idToken = req.body.idToken;
    // eslint-disable-next-line no-unused-vars
    const decodedToken = await auth.verifyIdToken(idToken);

    // Issue a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set the session cookie
    const options = { maxAge: expiresIn, httpOnly: true };
    res.cookie("session", sessionCookie, options);

    // Send the response
    res.status(200).json({ message: "User logged in" });
  }
  catch (error) {
    console.error("Error logging in:", error);
    res.status(400).send(error.message);
  }
}
module.exports = Login;
