const express = require('express');
const router = express.Router();
const { processPayment, getPaymentsByUser } = require('../controllers/paymentController');

router.post('/process', processPayment);
router.get('/:userId', getPaymentsByUser);

module.exports = router;
