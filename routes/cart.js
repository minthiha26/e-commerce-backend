const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");
const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const cart = await newCart.save();
    res.status(201).json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Cart has been deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
