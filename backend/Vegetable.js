const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 100
    }
}, {
    timestamps: true
});

const Vegetable = mongoose.model('Vegetable', vegetableSchema);

module.exports = Vegetable;
