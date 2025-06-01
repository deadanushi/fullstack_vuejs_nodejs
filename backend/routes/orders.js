const express = require('express');
const {
  getOrders,
  getAdminOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.get('/admin', protect, authorize('admin'), getAdminOrders);

router
  .route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin'), updateOrderStatus);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;