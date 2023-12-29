const jwt = require('jsonwebtoken');
const Auth = require('./auth');
const deleteUser= require('./auth').deleteUser;

class AuthController {
    async signUp(req, res) {
        try {
            const { email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType } = req.body;
            const userRecord = await Auth.signUp(email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType);
            console.log('Successfully created new user:', userRecord.uid);

            // Create a token
            const token = jwt.sign({ uid: userRecord.uid, role }, 'your-secret-key');

            // Send the token in the response
            res.status(200).json({ message: 'User created', token });
        } catch (error) {
            console.error('Error creating new user:', error);
            res.status(400).send(error.message);
        }
    }
  
    async login(req, res) { 
        try {
            const { email, password } = req.body;
            const userRecord = await Auth.login(email, password);
            console.log('Successfully logged in:', userRecord.uid);

            // Create a token
            const token = jwt.sign({ uid: userRecord.uid, role: userRecord.role }, 'your-secret-key');

            // Send the token in the response
            res.status(200).json({ message: 'User logged in', token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(400).send(error.message);
        }
    }
    async deleteUser (req, res) {
    try {
        const {uid} = req.body;
        const userRecord = await deleteUser(uid);
        res.status(200).json({ message: 'User deleted', userRecord });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete data", message: error.message });
    }
}
    async updatePassword(req, res) {
        try {
            const { uid, newPassword } = req.body;
            await Auth.updatePassword(uid, newPassword);
            res.status(200).json({ message: 'Password updated' });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(400).send(error.message);
        }
    }

}

module.exports = new AuthController();