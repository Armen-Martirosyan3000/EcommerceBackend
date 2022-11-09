//Ստեղծենք մեր առաջին user-ը, մենք կարող ենք գրանցվել կամ մուտք գործել, բայց դա անել մեր user.js(user rout-ի(երթուղիչ) մեջ)-ում ճիշտ չէ քանի որ login-ի(մուտք) գործընթացը այլ բան է, եթե ցանկանում եք ստեղծել ավելի անվտանգ հավելվածներ խորհուրդ է տրվում ստեղծել մեկ այլ rout օրինակ՝ auth.js (authentification-նույնականացում), և մենք գրանցվելու և մուտք գործելու ենք այս rout-ի ներսում
const router = require("express").Router();
const User = require("../models/User");// այստեղով ներմուծում ենք մեր User մոդելը որպեսզի օգտագործենք
// const CryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken");

//REGISTER-user-ի գրանցում, User-ը մեր User modeln է որը գտնվում է models-ի մեջ
//router.post-ով ստեղծում ենք մեր user-ին մեր db-ում, և այս օբյեկտը 
router.post("/register", async (req, res) => {//user-ը գրանցվելուց(register-ռեգիստրացիա) մեզ ուղարկելու է userName-ը, password-ը և այլ ինֆորմացիա , դա կատարվում է post request-ի(հարցման) միջոցով
  //User-ը մեր User modeln է որը գտնվում է models-ի մեջ
  //այստեղ post request-ով ստեղծում ենք նոր user
	const newUser = new User({//այստեղ գրում ենք այն գործառույթը, թե ինչպես ենք մենք օգտագործելու մեր մոդելները, առաջին հերթին User մոդելի rout-ն ենք գրում որը ստեղծում է նոր user-ին(newUser)
    username: req.body.username,// user-ի անունը հավասար է(username:) request(հարցմանը),իսկ body-ն մենք վերցնում ենք օգտվողից(user-ic) և օգտվողի անունից
    email: req.body.email,
    password: CryptoJS.AES.encrypt(//postman-ում ստեղծված նոր user-ի տվյալներում password-ը պարզ երևում է որը գնում է նաև մեր դատաբազա այդպես բաց ձևով, ավտանգության տեսակյունից սխալ է քանի որ եթե հակերային հարձակում լինի կվերցնեն այդ password-ները և ցանկացած user-ի ամբողջ ինֆորմացիան կգողանան, դա կանխելու համար մենք պետք է գաղտնագրենք մեր password-ները նախքան դատաբազայում պահելը
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {//try-փորձ անել, փորձարկել
    //մենք այստեղով պատրաստվում ենք տեղադրել newUser փոփոխականով ստեղծված նոր user-ի body-ն db-ում, բայց դա այդպես չէ դա նշանակում է որ մենք այստեղ ստեղծում ենք այս յուզեռին որը պարզապես օբյեկտ մոդել է որին մենք պետք է ուղարկենք մեր դատա բազայի մեջ  
    const savedUser = await newUser.save();// դրա համար մենք կօգտագործենք պահպանման մեթոդը և newUser-ին(նոր user-ին) պահպանենք db-ում(դատաբազայում) սակայն կա մի խնդիր մենք չենք կարող դա անել ուղակիորեն գրելով՝const savedUser = newUser.save() քանի որ դա promise(խոստում է) է որը հանդիսանում է ասինխրոն ֆունկցիա,ասինխրոն ֆունկցիա ասելով ի նկատի ունենք Երբ մենք պահում ենք ինչ որ փաստաթղթեր կամ թարմացնում կամ ջնջում կամ որևէ այլ բան մեր db-ում  դա տևում է մի քանի միլիվայրկյան կամ նույնիսկ վայրկյան դա կախված է մեր սերվերից, դա կախված է mongodb-ի սերվերից կամ օգտագործողի(յուզեռի) ինտերնետ կապից այդ պատճառով ըստ էության հնարավորություն չկա իմանալու այդ ճշգրիտ ժամանակը,այդ պատճառով եթե այս տողում մենք գրենք օրինակ const savedUser = newUser.save(), console.log(savedUser) դա չի աշխատի քանի որ կսկսի պահպանման պրոցեսը և դրանից հետո ակընթարթորեն կփորձենք տպել պահպանված user-ին console.log(savedUser)-ով, բայց այդ ժամանակ մենք չունենք պահպանված օգտվող, քանի որ դա կանխելու համար մի քանի միլիվայրկյան է պահանջվում, դրա համար այստեղ օգտագործում ենք async(ասինխրոն) ֆունկցիաները, որը կասի սպասիր(await) և մենք կսպասենք այս գործընթացին և եթե դրանից հետո մենք պահպանենք յուզեռին, բայց եթե որևէ խնդիր լինի մեր սերվերում կամ դատաբազայում որպեսզի բռնենք այդ էռոռը մենք գրում ենք try և catch բլոկը
    res.status(201).json(savedUser);//երբ մենք փորձենք պահպանել մեր նոր յուզեռին( const savedUser = await newUser.save()) ու դա հաջող լինի կուղարկենք այս պատասխանը՝ HTTP Status 201-ը ցույց է տալիս, որ HTTP POSTհարցման արդյունքում մեկ կամ մի քանի նոր ռեսուրսներ հաջողությամբ ստեղծվել են սերվերում:
  } catch (err) {
    res.status(500).json(err);//եթե որևէ խնդիր լինի մենք կուղարկենք այս էռոռը՝res status 500. Հաղորդագրություն. Ներքին սերվերի սխալ գտնել ապրանքը ըստ անվանման և գնի(500 Internal Server Errorսերվերի պատասխանի սխալ կոդը ցույց է տալիս, որ սերվերը բախվել է անսպասելի պայմանի, որը թույլ չի տվել կատարել հարցումը)
  }
});



 module.exports = router;