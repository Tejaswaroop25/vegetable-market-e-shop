const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getUserOrders, updateOrderStatus, updatePaymentStatus } = require('./orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/user/:email', getUserOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus);

module.exports = router;
