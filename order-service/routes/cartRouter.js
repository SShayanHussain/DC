const express = require("express");
const {getCartProducts, addCartProduct, deleteCartProduct, checkout} = require("../controllers/cartController");
const validateToken = require('../middleware/tokenValidationMiddleware');

const router = express.Router();

router.get("/cart", validateToken, getCartProducts);

router.post("/cart/:productid", validateToken, addCartProduct);

router.delete("/cart/checkout", validateToken, checkout);

router.delete("/cart/:productid", validateToken, deleteCartProduct);


module.exports = router