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
//այստեղ մենք ասում ենք ստուգել token-ը և թույլտվությունը(verifyTokenAndAuthorization)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {//ստուգել token-ը և թույլտվությունը(Authorization)
	if (req.body.password) {//մինչև UPDATE անելը մենք ստուգում ենք password-ը, որովհետև user-ը կարող է փոխել իր password-ը և այդ դեպքում մենք կրկին պետք է encrypt(ծածկագրել,գաղտնագրել) անենք user-ի նոր password-ը
	  req.body.password = CryptoJS.AES.encrypt(
		req.body.password,
		process.env.PASS_SEC
	  ).toString();
	}//սրանից հետո նոր մենք կարող ենք թարմացնել մեր user-ին
  
	try {//այստեղ մենք կասենք try փորձել թարմացնել user-ին՝updatedUser
		//Mongoose-ի Գործառույթներից մեկը findByIdAndUpdate() -ն է, որն իսկապես օգտակար է տվյալների բազայում թարմացման գործողություններ կատարելու համար: Իհարկե, Mongoose գրադարանում կան բազմաթիվ թարմացման գործառույթներ տվյալների բազայում տվյալների թարմացման համար, բայց findByIdAndUpdate()-ը հիմնականում օգտագործվում է իր պարզության և ճկունության պատճառով:Մենք գիտենք, որ MongoDB-ում յուրաքանչյուր փաստաթուղթ ունի իր ուրույն ավտոմատ ստեղծվող  _id դաշտը: Այս  ID-  ն փոխանցվում է  findByIdAndUpdate() ֆունկցիայի ներսում։ Այդ համապատասխան ID-ով փաստաթուղթը ստանալուց հետո այն պարզապես թարմացնում է փաստաթղթի ներսում եղած տվյալները:
	  const updatedUser = await User.findByIdAndUpdate(//User-ը User մոդելն է և կասենք id-ով գտիր ու թարմացրու՝ findByIdAndUpdate(գտնել ըստ ID-ի և թարմացնել)
		req.params.id,// թարմացվող user-ի id-ն է
		{//այստեղ գրել ենք այն ինչը պատրաստվում ենք թարմացնել, հիմնականում վերցնում են ամեն ինչ հարցման ներսում և body-ն($set: req.body) ու սահմանեք իրեն կրկին
			//$set մեթոդ-ը օգտագործվում է օբյեկտի հատկությանը արժեք նշանակելու համար, որը տրված է property(հատկություն) անունը որպես տող:$setնաև պարամետրացված հատկության արժեքը սահմանելու միակ միջոցն է:  
		  $set: req.body,//ինչպես ենք պատրաստվում սահմանել նոր ինֆորմացիամեր յուզեռի համար
		},
		{ new: true }//սրանով մենք վերադարձնում ենք թարմացված user-ին
	  );
	  res.status(200).json(updatedUser);// եթե ամեն ինչ նորմալ է ուղարկում ենք սա՝updatedUser(թարմացված user)
	} catch (err) {
	  res.status(500).json(err);//եթե էռոռ կա ուղարկում ենք err
	}
  });




module.exports = router; //ինչու է այս գրելաձևով արտահանում 



