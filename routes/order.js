const jwt_decode = require("jwt-decode")
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create order

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  const token = req.headers.token;
  const jwtToken = token.split(" ")[1];

  const decodedToken = jwt_decode(jwtToken)

  Order.find({}, async (err, orders) => {
    if (err) {
      return res.status(500).json("something went wrong please try again")
    }
    if (req.user.isAdmin) {
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    } else if (newOrder.userId !== decodedToken.id) {
      return res.status(500).json("You are not alowed to do that!")
    }
    else {
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
    }

  });
});


//Update order

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});


//Delete order

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});


//Get User Orders

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});


//Get all users

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});


// Get monthly income

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth(), 1));
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
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});

module.exports = router;