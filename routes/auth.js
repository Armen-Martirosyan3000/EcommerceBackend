const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//Register user

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    confirmpassword: CryptoJS.AES.encrypt(
      req.body.confirmpassword,
      process.env.PASS_SEC
    ).toString(),
  });
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  try {
    if (password === confirmpassword) {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
    else {
      res.status(500).json("confirmPassword does not match password");
    }
  } catch (err) {
    res.status(500).json("A user with this username or email exists");
  }
});


//Login user

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
      return res.status(401).json("Wrong credentials")
  } 
    
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;
   if(originalPassword !== inputPassword ) {
    return  res.status(401).json("Wrong credentials");
   }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json("something went wrong please try again");
  }
});


module.exports = router;