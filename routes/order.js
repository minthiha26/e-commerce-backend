const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");
const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Order has been deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findOne({ userId: req.params.userId });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(500).json(income);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
