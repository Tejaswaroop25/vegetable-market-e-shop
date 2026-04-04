const User = require('./User');
const Login = require('./Login');


// @desc    Sync user data with database (Create if not exists, else Update)
// @route   POST /api/users/sync
const syncUser = async (req, res) => {
    try {
        const { name, email, picture, googleId } = req.body;

        if (!googleId || !email) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        const user = await User.findOneAndUpdate(
            { googleId },
            { name, email, picture },
            { upsert: true, new: true }
        );

        // Record a login entry
        await Login.create({
            userId: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture
        });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all login logs
// @route   GET /api/users/logins
const getAllLogins = async (req, res) => {
    try {
        const logins = await Login.find().sort({ createdAt: -1 });
        res.status(200).json(logins);
    } catch (error) {
        console.error('Error fetching logins:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete single login record
// @route   DELETE /api/users/logins/:id
const deleteLogin = async (req, res) => {
    try {
        await Login.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Login record deleted' });
    } catch (error) {
        console.error('Error deleting login:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Clear all login records
// @route   DELETE /api/users/logins
const clearAllLogins = async (req, res) => {
    try {
        await Login.deleteMany({});
        res.status(200).json({ message: 'All login records cleared' });
    } catch (error) {
        console.error('Error clearing logins:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    syncUser,
    getAllLogins,
    deleteLogin,
    clearAllLogins
};


