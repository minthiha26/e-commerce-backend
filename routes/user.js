const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const { PASSWORD_SECRET } = require("../config");
const router = express.Router();

// UPDATE USER
router.put("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      PASSWORD_SECRET
    ).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updateUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE
router.delete("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User has been deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    // const { password, ...other } = user._doc;
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
