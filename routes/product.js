const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const Product = require("../models/Product");
const { PASSWORD_SECRET } = require("../config");
const router = express.Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product has been deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET ALL USER
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
