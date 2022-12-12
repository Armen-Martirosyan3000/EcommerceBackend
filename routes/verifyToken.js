const jwt = require("jsonwebtoken");

//verifyToken-user-ի token-ի ստուգում

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      console.log(user.id)
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};


//verifyTokenAndAuthorization-ստուգել token-ը և թույլատվությունը

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");// իսկ եթե մուտք գործողը չի համապատասխանում այս՝req.user.id === req.params.id || req.user.isAdmin պայմանին մենք իրեն ուղարկում ենք՝You are not alowed to do that(Ձեզ դա թույլ չի տրվում)
    }
  });
};


//verifyTokenAndAdmin-token-ի և Admin-ի ստուգում

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
}