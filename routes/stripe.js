const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);//սրանով stripe-ից վերցրած տոկեն-ը որ դրել ենք env ֆայլում, մենք կկարողանանք օգտագործել

router.post("/payment", (req, res) => {

  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;