const { auth, db } = require("../controller/db");
const { createData } = require("../controller/CRUD");

/**
 * Class representing the authentication functionality.
 */
class Auth {
  /**
   * Create an Auth object.
   * @param {Object} authInstance - The Firebase Authentication instance.
   */
  constructor(authInstance) {
    this.auth = authInstance;
  }

  /**
   * Sign up a new user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} name - The user's name.
   * @param {string} contactNumber - The user's contact number.
   * @param {string} role - The user's role.
   * @param {string} userId - The user's ID.
   * @param {string} partnerType - The user's partner type.
   * @param {number} walletBalance - The user's wallet balance.
   * @param {Object} packageType - The user's package type.
   * @param {Object} serviceType - The user's service type.
   * @return {Promise<Object>} The user record.
   * @throws {Error} If an error occurs during sign up.
   */
  async signUp(
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
  ) {
    try {
      const userRecord = await this.auth.createUser({
        email: email,
        password: password,
      });

      const userData = {
        name: name,
        email: email,
        contactNumber: contactNumber,
        role: role,
        userId: userId,
        partnerType: partnerType || "prepaid",
        walletBalance: walletBalance || 0,
        serviceType: serviceType || "ecom",
        package: {
          packageName: packageType.packageName || "",
          packagePrice: packageType.packagePrice || "",
          packageDuration: packageType.packageDuration || "",
        },
        userUID: userRecord.uid,
      };

      await createData("users", userRecord.uid, userData);

      return userRecord;
    }
    catch (error) {
      throw new Error(error);
    }
  }
  /**
   * Delete a user.
   * @param {string} uid - The user's Firebase UID.
   * @throws {Error} If an error occurs during deletion.
   */
  async deleteUser(uid) {
    try {
      // Delete the user from Firebase Authentication
      await auth.deleteUser(uid);

      await db.collection("users").doc(uid).delete();

      console.log(`Successfully deleted user with ID: ${uid}`);
    }
    catch (error) {
      console.error(`Error deleting user: ${error}`);
      throw new Error(error);
    }
  }
  // eslint-disable-next-line require-jsdoc
  async updatePassword(uid, newPassword) {
    try {
      await auth.updateUser(uid, {
        password: newPassword,
      });

      console.log(`Successfully updated user with ID: ${uid}`);
    }
    catch (error) {
      console.error(`Error updating user: ${error}`);
      throw new Error(error);
    }
  }
}

module.exports = new Auth(auth);
