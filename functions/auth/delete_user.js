const deleteUser = require("./auth").deleteUser;
/**
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @async
 */
const deleteUserRoute = async (req, res) => {
  try {
    const { uid } = req.body;
    const userRecord = await deleteUser(uid);
    res.status(200).json({ message: "User deleted", userRecord });
  }
  catch (error) {
    console.log(error);
    res
        .status(500)
        .json({ error: "Failed to delete data", message: error.message });
  }
};
module.exports = deleteUserRoute;
