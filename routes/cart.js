const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode")
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create cart

router.post("/", verifyToken, (req, res) => {
  const newCart = new Cart(req.body);
  const token = req.headers.token;
  const jwtToken = token.split(" ")[1];

  const decodedToken = jwt_decode(jwtToken)
  Cart.find({}, async (err, carts) => {
    console.log(carts);
    if (err) {
      return res.status(500).json(err)
    }
    if (carts.some(cart => newCart.userId === cart.userId && req.user.isAdmin)) {
      return res.status(500).json("this user already has a cart created")
    } if (carts.some(cart => req.user.isAdmin && newCart.userId !== cart.userId)) {
      const savedCart = await newCart.save();
      return res.status(200).json(savedCart);
    }
    else if (carts.some(cart => newCart.userId === decodedToken.id && newCart.userId === cart.userId //cart-ի փոխարեն կարա այլ անուն լինի  
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


//Update cart

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


//Delete cart

router.delete("/:userId/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//Get user cart

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {//userId-ին օգտոգործողի id-ն է(user-ի նույնականացուցիչը)
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });// ամեն user ունի ընդհամենը 1 cart(զամբյուղ) դրա համար գրում ենք findOne ֆունկցիան,FindOne () մեթոդը գտնում և վերադարձնում է մեկ փաստաթուղթ, որը համապատասխանում է տվյալ ընտրության չափանիշներին: Եթե ​​մի քանի փաստաթղթեր բավարարում են հարցման տրված արտահայտությունը, ապա այս մեթոդը կվերադարձնի առաջին փաստաթուղթը բնական կարգով, որն արտացոլում է սկավառակի վրա փաստաթղթերի հերթականությունը: Եթե ​​ոչ մի փաստաթուղթ չի համապատասխանում ընտրության չափանիշներին, ապա այս մեթոդը կվերադարձնի անվավեր: Այն պահանջում է երկու պարամետր, առաջինը հարցման չափանիշն է, իսկ մյուսը կամընտիր է:
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Get all cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;