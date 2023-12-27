const jwt = require('jsonwebtoken');
const auth = require('./auth');

class AuthController {
    async signUp(req, res) {
        try {
            const { email, password, name, contactNumber, role } = req.body;
            const userRecord = await auth.signUp(email, password, name, contactNumber, role);
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
            const userRecord = await auth.login(email, password);
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
}

module.exports = new AuthController();