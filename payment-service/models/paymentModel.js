const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        userId:        { type: String, required: true },
        orderId:       { type: String, required: true },
        amount:        { type: Number, required: true },
        status:        { type: String, enum: ['success', 'failed'], default: 'success' },
        transactionId: { type: String, required: true },
        method:        { type: String, default: 'simulated' },
        paymentType:   { type: String, enum: ['purchase', 'subscription'], default: 'purchase' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
