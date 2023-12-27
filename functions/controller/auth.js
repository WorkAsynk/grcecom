const { auth, db } = require('./db');
const { createData } = require('./CRUD');
class Auth {
    constructor(authInstance) {
        this.auth = authInstance;
    }

    async signUp(email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType) {
        try {
            const userRecord = await this.auth.createUser({
                email: email,
                password: password
            });

            const userData = {
                name: name,
                email: email,
                contactNumber: contactNumber,
                role: role,
                userId: userId,
                partnerType: partnerType || 'prepaid', // default to 'prepaid' if no value is provided
                walletBalance: walletBalance || 0, // default to 0 if no value is provided
                package: {
                    packageName: packageType.packageName || '',
                    packagePrice: packageType.packagePrice || '',
                    packageDuration: packageType.packageDuration || ''
                },
                userUID: userRecord.uid
            };

            await createData('users', userRecord.uid, userData);

            return userRecord;
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteUser(uid) {
        try {
            // Delete the user from Firebase Authentication
            await auth.deleteUser(uid);
    
            await db.collection('users').doc(uid).delete();
    
            console.log(`Successfully deleted user with ID: ${uid}`);
        } catch (error) {
            console.error(`Error deleting user: ${error}`);
            throw new Error(error);
        }
    }
}

module.exports = new Auth(auth);