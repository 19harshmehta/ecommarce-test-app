const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createOrder,getMyOrders,getOrderById } = require('../controllers/order');

router.post('/checkout', authenticate, createOrder);

router.get("/my", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);

module.exports = router;