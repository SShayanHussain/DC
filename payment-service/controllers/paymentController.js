const { randomUUID } = require('crypto');
const Payment = require('../models/paymentModel');

const processPayment = async (req, res) => {
    const { userId, orderId, amount } = req.body;

    if (!userId || !orderId || amount === undefined) {
        return res.status(400).json({ message: 'userId, orderId, and amount are required' });
    }

    const transactionId = randomUUID();

    const { paymentType } = req.body;

    const payment = await Payment.create({
        userId,
        orderId,
        amount,
        status: 'success',
        transactionId,
        method: 'simulated',
        paymentType: paymentType || 'purchase',
    });

    res.status(201).json({
        status: 'success',
        transactionId: payment.transactionId,
        amount: payment.amount,
        paymentId: payment._id,
    });
};

const getPaymentsByUser = async (req, res) => {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(payments);
};

module.exports = { processPayment, getPaymentsByUser };
