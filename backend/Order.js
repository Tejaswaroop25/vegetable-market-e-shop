const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: [
        {
            vegetableId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vegetable',
                required: false
            },
            name: String,
            quantity: Number,
            pricePerKg: Number,
            totalPrice: Number
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    distance: {
        type: Number, // in KM
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash on Delivery', 'Online Payment']
    },
    userEmail: {
        type: String,
        required: false
    },
    transactionId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Placed', 'Accepted', 'Started', 'Arrived', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
