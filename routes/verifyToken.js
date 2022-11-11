const jwt = require("jsonwebtoken");
//verifyToken-ստուգել Token-ը,
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;//postman-ում մտնում ենք headers ու ստեղծում ենք token անունով key ու որպես արժեք տալիս ենք որաշակի խառը կոդ ու այդ token-ի արժեքը դնում ենք authHeader փոփոխականի մեջ այս՝req.headers.token կոդի միջոցով, այդ token-ը մեր JSON վեբ token-ն է
  if (authHeader) {//այստեղով ասում ենք ստուգել կա authHeader(վավերականության վերնագիր) թե ոչ
    const token = authHeader.split(" ")[1];//եթե մենք ունենանք token մենք դա պետք է ստուգենք
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {//եթե մենք ունենանք token մենք դա պետք է ստուգենք, դրա համար օգտագործում ենք ստուգման jwt.verify() ֆունկցիա և ստուգենք, այստեղ գրում ենք մեր token-ը որից հետո մեր secret key-ն և վերջապես ստուգումից հետո նա մեզ կվերադարձնի կամ error` (err, user) կամ էլ եթե ամեն ինչ նորմալ է կվերադարձնի user-ի տվյալները
      if (err) res.status(403).json("Token is not valid!");//իսկ եթե սխալ կա  ես նոր error կվերադարձնեմ այստեղ, Token is not valid!-Token-ը անվավեր է, այն կարող է ժամկետանց լինել, քանի որ մենք դրել ենք որ token-ը ակտիվ է 3 օր`auth.js( {expiresIn:"3d"}) կամ էլ լինի ոչ ճիշտ token
      req.user = user;// եթե token-ում ամեն ինչ նորմալ է, req.user-ը հավասր կլինի այդ user-ին, 
      next(); //որից հետո նա կթողնի այս ֆունկցիան և կգնա դեպի rout(user.js) և կշարունակի գործարկել այդ գործառույթը՝ router.put()
    });
  } else {//եթե չկա authHeader(վավերականության վերնագիր) մենք վերադարձնում ենք error
    return res.status(401).json("You are not authenticated!");//սխալի(eror) դեպքում սա ենք ուղարկելու՝You are not authenticated!(դուք վավերացված չեք)
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

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
  verifyTokenAndAdmin,
};