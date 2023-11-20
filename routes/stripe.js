const express = require("express");
const { STRIPE_SECRET_KEY } = require("../config");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json({ message: stripeErr });
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
