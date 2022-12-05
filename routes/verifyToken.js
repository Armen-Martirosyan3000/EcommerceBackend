const jwt = require("jsonwebtoken");
//verifyToken-ստուգել Token-ը, այստեղով մենք առաջինը ստուգում ենք user-ի token-ը
const verifyToken = (req, res, next) => {
  //console.log(1)
  const authHeader = req.headers.token;//postman-ում մտնում ենք headers ու ստեղծում ենք token անունով key ու որպես արժեք տալիս ենք որաշակի խառը կոդ ու այդ token-ի արժեքը դնում ենք authHeader փոփոխականի մեջ այս՝req.headers.token կոդի միջոցով, այդ token-ը մեր JSON վեբ token-ն է
  if (authHeader) {//այստեղով ասում ենք ստուգել կա authHeader(վավերականության վերնագիր) թե ոչ
    const token = authHeader.split(" ")[1];//postman-ում bearer(բեռնակիր, Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)-ի փոխարեն ուրիշ բառ որ գրում ես էլի աշխատում է, բայց js-ում կա Bearer token-ը նշանի մի տեսակ է, որը կարող է օգտագործվել հաճախորդի հավելվածի կողմից API-ին հասանելիություն ստանալու համար՝ օգտագործելով միայն token-ը
    
    //split օրինակ
    //const authHeader = 'bearer token'
    //const split = authHeader.split(' ') //  [ 'bearer', 'token' ]
    //const token = split[1] //  token
    //եթե մենք ունենանք token մենք դա պետք է ստուգենք
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {//եթե մենք ունենանք token մենք դա պետք է ստուգենք, դրա համար օգտագործում ենք ստուգման jwt.verify() ֆունկցիա և ստուգենք, այստեղ գրում ենք մեր token-ը որից հետո մեր secret key-ն և վերջապես ստուգումից հետո նա մեզ կվերադարձնի կամ error` (err, user) կամ էլ եթե ամեն ինչ նորմալ է կվերադարձնի user-ի տվյալները
      if (err) res.status(403).json("Token is not valid!");//իսկ եթե սխալ կա  ես նոր error կվերադարձնեմ այստեղ, Token is not valid!-Token-ը անվավեր է, այն կարող է ժամկետանց լինել, քանի որ մենք դրել ենք որ token-ը ակտիվ է 3 օր`auth.js( {expiresIn:"3d"}) կամ էլ լինի ոչ ճիշտ token
      req.user = user;// եթե token-ում ամեն ինչ նորմալ է, req.user-ը հավասր կլինի այդ user-ին, 
      console.log(user.id)
      next(); //որից հետո նա կթողնի այս ֆունկցիան և կգնա դեպի rout(user.js) և կշարունակի գործարկել այդ գործառույթը՝ router.put()
    });
  } else {//եթե չկա authHeader(վավերականության վերնագիր) մենք վերադարձնում ենք error
    return res.status(401).json("You are not authenticated!");//սխալի(eror) դեպքում սա ենք ուղարկելու՝You are not authenticated!(դուք վավերացված չեք)
  }
};

//verifyTokenAndAuthorization-ստուգել token-ը և թույլտվությունը
const verifyTokenAndAuthorization = (req, res, next) => {
  //վերևում verifyToken այս ֆունկցիայով ստուգվում է տոկենը իսկ դրանից հետո ստուգվում է req.user.id === req.params.id-ների համապատասխանությունը ինչպես նաև տվյալ յուզեռը հանդիսանում է ադմին՝req.user.isAdmin թե ոչ որից հետո կարող ենք շարունակել մեր հաջորդ գործառույթը՝next()
  verifyToken(req, res, () => {// առաջին հերթին այստեղով մենք որոշում ենք token-ը պատկանում է հաճախորդներին կամ ադմինիստրատորին(admin) թե ոչ
    if (req.user.id === req.params.userId || req.user.isAdmin) {//այստեղով մենք որոշում ենք մուտք գործողի id-ն հավասար է գրանցված user-ի id-ին (եթե հավասար են դա նշանակում է որ մուտք գործողը ու գրանցվածը նույն user-ն է որին թույլատրվում է թարմացում անել), params.id-ն user.js-ի update բաժնի նույն "/:id"-ն է, իսկ սրանով՝ req.user.isAdmin մենք ստուգում ենք այդ user-ը admin-նն է թե ոչ
      //req.user.id === req.params.id այս պայմանին համապատասխանելու դեպքում նոր մուտք գործող user-ին հնարավորություն կտանք թարմացնել տվյալները(update)
      next();//հաջորդը
    } else {
      res.status(403).json("You are not alowed to do that!");// իսկ եթե մուտք գործողը չի համապատասխանում այս՝req.user.id === req.params.id || req.user.isAdmin պայմանին մենք իրեն ուղարկում ենք՝You are not alowed to do that(Ձեզ դա թույլ չի տրվում)
    }
  });
};



//Միայն Admin-ը կարող է ավելացնել ցանկացած ապրանք(models->Product.js) և ցանկացած այլ բան, դրա համար ստեղծում ենք այս ֆունկցիան որը կստուգի ստուգեք Token-ը և Admin-ը
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {// այստեղով ստուգվում է եթե user-ը Admin-նն է մենք կշարունակենք՝next()-ով մեր rout funkcian`user.js-ում
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