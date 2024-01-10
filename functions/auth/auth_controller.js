const jwt = require('jsonwebtoken');
const Auth = require('./auth');
const deleteUser = require('./auth').deleteUser;

class AuthController {
    async signUp(req, res) {
        try {
            const { email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType } = req.body;
            const userRecord = await Auth.signUp(email, password, name, contactNumber, role, userId, partnerType, walletBalance, packageType);
            console.log('Successfully created new user:', userRecord.uid);

            // Create a token
            const token = jwt.sign({ uid: userRecord.uid, role }, 'your-secret-key');

            // Set the token as an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                // secure: true, // Uncomment this line to send the cookie over HTTPS only
                // domain: 'your-domain.com', // Uncomment and replace with your domain if serving across multiple domains
                // maxAge: 3600000 // Uncomment and set the desired cookie duration in milliseconds
            });

            // Send the response
            res.status(200).json({ message: 'User created' });
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

            // Set the token as an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                // secure: true, // Uncomment this line to send the cookie over HTTPS only
                // domain: 'your-domain.com', // Uncomment and replace with your domain if serving across multiple domains
                // maxAge: 3600000 // Uncomment and set the desired cookie duration in milliseconds
            });

            // Send the response
            res.status(200).json({ message: 'User logged in' });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(400).send(error.message);
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
    async authenticateToken(req, res, next) {
        // Extract the token from the cookies
        const token = req.cookies.token;

        if (token == null) {
            return res.sendStatus(401);
        }

        jwt.verify(token, 'your-secret-key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }

}

module.exports = new AuthController();