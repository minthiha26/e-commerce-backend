const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { DB_URL, PORT } = require("./config");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripe");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT || 3000, () => {
      console.log("server is running on port", PORT);
    });
  })
  .catch((err) => console.log(err));
