const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/tokenValidationMiddleware");
const { getUser, userRegister, loginUser, subscribe, getSubscriptionStatus } = require("../controllers/usercontroller");

router.post("/register", userRegister);
router.post("/login", loginUser);
router.get("/profile", validateToken, getUser);
router.post("/subscribe", validateToken, subscribe);
router.get("/subscription", validateToken, getSubscriptionStatus);

module.exports = router;
