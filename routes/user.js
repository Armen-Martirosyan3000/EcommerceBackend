//ստեղծենք օգտագործողի(user) rout-ը(երթուղին, ուղին)
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router=require("express").Router();//Express.Router () ֆունկցիան օգտագործվում է նոր router օբյեկտ ստեղծելու համար։ Այս ֆունկցիան օգտագործվում է, երբ ցանկանում եք ձեր ծրագրում ստեղծել նոր router օբյեկտ՝ հարցումները կարգավորելու համար: Բազմաթիվ հարցումները կարելի է հեշտությամբ տարբերակել Express.js-ում Router() ֆունկցիայի օգնությամբ:


//սա գրվել է փորձարկման համար
// router.get("/usertest", (req,res)=>{// get-ստացիր
// 	res.send("user test is successfull")// user-ը(օգտվողը) կարող է մուտքագրել օգտվողի անունը կամ էլ փոստ որից հետո մենք պատասխան(response) կուղարկենք օգտատիրոջը՝user test is successfull(օգտատիրոջ թեստը հաջողված է)
// })

//սա գրվել է փորձարկման համար
// router.post("/userposttest", (req,res)=>{//այս մեթոդը նշանակում է որ մենք պետք է որոշ հարցումներ ընդունեք մեր օգտատիրոջից(user-ից, հաճախորդից)։
// 	const userName=req.body.userName//Օրինակ եկեք վերցնենք օգտվողի անունը մեր հաճախորդի կայքից` const userName=req.body.userName։ body-ն հիմնականում այն է,ինչ մենք փոխանցում ենք մեր սերվերին, հիմնականում եթե մենք ուղարկում ենք որևէ օգտվողի անուն նամակով կամ որևէ մուտքագրում, պետք է գրենք այստեղ, մենք կփոխանցենք ամեն ինչ մեր body-ի ներսում և դրանից հետո մենք կոնսոլ լոգ կանենք userName-ը, որպեսզի ինչպես մենք փոխանցենք այս հարցումը
//     res.send("your userName is:" + userName )//postman-ում սաքրել եմ  {"userName": "ArmMar"} այս JSON օբյեկտը, և երբ send(ուղարկել) եմ անում բերում է այս տեքստը՝ your userName is:ArmMar, երբ այստեղ {"userName": "Karen"} նշեմ օրինակ Karen send անելուց հետո կբերի your userName is:Karen
// })

//UPDATE-user-ի տվյալների թարմացում
//:id-ն յուզեռի id-ն է, այն պարամետր է
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {//ստուգել token-ը և թույլտվությունը(Authorization)
	if (req.body.password) {
	  req.body.password = CryptoJS.AES.encrypt(
		req.body.password,
		process.env.PASS_SEC
	  ).toString();
	}
  
	try {
	  const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
		  $set: req.body,
		},
		{ new: true }
	  );
	  res.status(200).json(updatedUser);
	} catch (err) {
	  res.status(500).json(err);
	}
  });




module.exports = router; //ինչու է այս գրելաձևով արտահանում 



