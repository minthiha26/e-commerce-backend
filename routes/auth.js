const express = require("express");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { PASSWORD_SECRET, JWT_SECRET } = require("../config");
const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Enter your user name, email and password!" });
    }

    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        PASSWORD_SECRET
      ).toString(),
    };

    const saveUser = await User.create(newUser);
    return res.status(201).json(saveUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Enter your user name and password!" });
    }

    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json({ message: "Wrong Username!" });

    const hashedPassword = CryptoJS.AES.decrypt(user.password, PASSWORD_SECRET);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json({ message: "Wrong Password!" });

    const accessToken = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...other } = user._doc;

    return res.status(200).json({ ...other, accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
