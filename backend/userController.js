const User = require('./User');

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

        res.status(200).json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    syncUser
};
