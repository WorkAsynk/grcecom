const jwt = require('jsonwebtoken');
const Auth = require('./auth');
const deleteUser = require('./auth').deleteUser;
const { auth} = require('../controller/db'); // Replace './db' with the path to your db.js file

class AuthController {
    async signUp(req, res) {
        try {
            const { email, password, name, contactNumber,  userId, partnerType, packageType, role } = req.body;
            const walletBalance = 0;
            const userRecord = await Auth.signUp(email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType);
            console.log('Successfully created new user:', userRecord.uid);

            // Create a custom token
            const customToken = await auth.createCustomToken(userRecord.uid);

            // Send the response along with the custom token
            res.status(200).json({ message: 'User created', customToken: customToken });
        } catch (error) {
            console.error('Error creating new user:', error);
            res.status(400).send(error.message);
        }
    }
    async  login(req, res) {
        try {
            // Verify the ID token
            const idToken = req.body.idToken;
            const decodedToken = await auth.verifyIdToken(idToken);

            // Issue a session cookie
            const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
            const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

            // Set the session cookie
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie('session', sessionCookie, options);

            // Send the response
            res.status(200).json({ message: 'User logged in' });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(400).send(error.message);
        }
    }
    async  authenticateToken(req, res, next) {
        // Extract the session cookie from the cookies
        const sessionCookie = req.cookies.session;
    
        if (!sessionCookie) {
            return res.sendStatus(401);
        }
    
        try {
            // Verify the session cookie
            const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
            // Set req.user to the decoded claims
            req.user = decodedClaims;
    
            next();
        } catch (error) {
            console.error('Error verifying session cookie:', error);
            res.sendStatus(403);
        }
    }
    async deleteUser(req, res) {
        try {
            const { uid } = req.body;
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