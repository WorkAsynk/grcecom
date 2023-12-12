const auth = require('../controller/auth');

const signUp = async (req, res) => {
    try {
        const { email, password, name, contactNumber, role } = req.body;
        const userRecord = await auth.signUp(email, password, name, contactNumber, role);
        console.log('Successfully created new user:', userRecord.uid);
        res.status(200).send('User created');
    } catch (error) {
        console.error('Error creating new user:', error);
        res.status(400).send(error.message);
    }
}

module.exports = signUp;