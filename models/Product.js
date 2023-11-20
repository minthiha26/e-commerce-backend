const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
