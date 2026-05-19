const userModel = require('../models/userModel');
const UserModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

// const getUsers = async (req, res) => {
//     // const allusers = await userModel.find();
//     res.json(req.user)
// }

const getUser = async (req, res) => {
    const user = await userModel.findById(req.user.id, { password: 0 });
    // console.log(req.user.id);
    res.json(user);
    // res.json({message: `information of user with id ${req.params.id}`})
}

const userRegister = async (req, res) => {

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const foundUser = await userModel.findOne({ email: email });
    if (foundUser) {
        res.status(400).json({ message: "user already exists" })
    } else {
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            phone: req.body.phone,
            gender: req.body.gender
        }



        )

        res.json(user.id)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            phone: user.phone,
            gender: user.gender
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "5m" }
      );
      res.status(200).json(accessToken);
      console.log(accessToken);
    } else {
      res.status(401).json({ message: "Wrong email or password" });
    }
    // res.json({message: "user logged in" })
  };
  

const subscribe = async (req, res) => {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { data: payment } = await axios.post(`${PAYMENT_SERVICE_URL}/payments/process`, {
        userId: req.user.id,
        orderId: `sub_${Date.now()}`,
        amount: 9.99,
        paymentType: 'subscription',
    });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    user.subscriptionStatus = 'premium';
    user.subscriptionExpiry = expiry;
    await user.save();

    res.json({ subscriptionStatus: user.subscriptionStatus, subscriptionExpiry: user.subscriptionExpiry, payment });
};

const getSubscriptionStatus = async (req, res) => {
    const user = await userModel.findById(req.user.id, { subscriptionStatus: 1, subscriptionExpiry: 1 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ subscriptionStatus: user.subscriptionStatus, subscriptionExpiry: user.subscriptionExpiry });
};

module.exports = {
    getUser,
    userRegister,
    loginUser,
    subscribe,
    getSubscriptionStatus,
}