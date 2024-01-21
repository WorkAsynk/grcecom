const Auth = require('./auth');
async function updatePassword(req, res) {
    try {
        const { uid, newPassword } = req.body;
        await Auth.updatePassword(uid, newPassword);
        res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(400).send(error.message);
    }
}

module.exports = updatePassword;