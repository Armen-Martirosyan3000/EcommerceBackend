//cart rout
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode")
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE cart

router.post("/", verifyToken, (req, res) => {
  const newCart = new Cart(req.body);
  const token = req.headers.token
  const jwtToken = token.split(" ")[1];

  const decodedToken = jwt_decode(jwtToken)
  Cart.find({}, async (err, carts) => {
    console.log(carts);
    if (err) {
      return res.status(500).json(err)
    }
    if (carts.some(cart => newCart.userId === decodedToken.id && newCart.userId === cart.userId
    )) {
      return res.status(500).json("this user already has a cart created")

    } else if (newCart.userId !== decodedToken.id) {
      return res.status(500).json("You are not alowed to do that!")
    }
    else {
      const savedCart = await newCart.save();
      return res.status(200).json(savedCart);
    }

  });

});

//UPDATE cart
router.put("/:userId/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE cart
router.delete("/:userId/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;