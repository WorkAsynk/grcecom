const { auth } = require('./db');
const { createData } = require('./CRUD');

class Auth {
    constructor(authInstance) {
        this.auth = authInstance;
    }

    async signUp(email, password, name, contactNumber, role) {
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
                userUID: userRecord.uid
            };

            await createData('users', userRecord.uid, userData);

            return userRecord;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new Auth(auth);