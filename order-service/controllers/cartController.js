const axios = require('axios');
const CartModel = require('../models/cartModel');
require('dotenv').config();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

const getCartProducts = async (req, res) => {
    const cartItems = await CartModel.find({ UserId: req.user.id });

    const products = [];
    let total = 0;

    for (const item of cartItems) {
        try {
            const { data: product } = await axios.get(
                `${PRODUCT_SERVICE_URL}/products/${item.ProductId}`
            );
            products.push(product);
            total += product.price || 0;
        } catch {
            // product not found or product-service unavailable — skip
        }
    }

    res.json({ Products: products, total });
};

const addCartProduct = async (req, res) => {
    const cartProduct = await CartModel.create({
        UserId: req.user.id,
        ProductId: req.params.productid,
    });
    res.json(cartProduct);
};

const deleteCartProduct = async (req, res) => {
    const cartProduct = await CartModel.findOneAndDelete({
        UserId: req.user.id,
        ProductId: req.params.productid,
    });
    res.json(cartProduct);
};

const checkout = async (req, res) => {
    const cartItems = await CartModel.find({ UserId: req.user.id });

    let total = 0;
    for (const item of cartItems) {
        try {
            const { data: product } = await axios.get(
                `${PRODUCT_SERVICE_URL}/products/${item.ProductId}`
            );
            total += product.price || 0;
        } catch {
            // skip unavailable products
        }
    }

    // Call payment-service to process payment
    let paymentResult = null;
    try {
        const { data } = await axios.post(`${PAYMENT_SERVICE_URL}/payments/process`, {
            userId: req.user.id,
            amount: total,
            orderId: `order_${Date.now()}`,
        });
        paymentResult = data;
    } catch (err) {
        return res.status(502).json({ message: 'Payment service unavailable', error: err.message });
    }

    // Clear cart after successful payment
    await CartModel.deleteMany({ UserId: req.user.id });

    res.json({ message: 'Checkout successful', total, payment: paymentResult });
};

module.exports = { getCartProducts, addCartProduct, deleteCartProduct, checkout };
