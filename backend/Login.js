const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String,
    email: String,
    picture: String,
    loginTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;
