const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router=require("express").Router();



//Update user

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
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


  //Delete user

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
	  await User.findByIdAndDelete(req.params.id);
	  res.status(200).json("User has been deleted...");
	} catch (err) {
	  res.status(500).json(err);
	}
  });


  //Get user-ADMIN-ը ստանում է 1 user-ի տվյալները

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
	  const user = await User.findById(req.params.id);
	  const { password, ...others } = user._doc;
	  console.log(user)
	  res.status(200).json(others);
	} catch (err) {
	  res.status(500).json(err);
	}
  });


  //Get all users-ADMIN-ը ստանում է բոլոր user-ների տվյալները
  
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	const query = req.query.new;
	try {
	  const users = query 
	  ? await User.find().sort({ _id: -1 }).limit(3)
	  : await User.find();
	  res.status(200).json(users);
	} catch (err) {
	  res.status(500).json(err);
	}
  });

  
  //GET USER STATS-ՍՏԱՆԱԼ user-ի վիճակագրությունը ամսվա կտրվածքով, GET-ից կարող է օգտվել միայն ADMIN-ը
// Այս ստատիստիկան կվերադարձնի որպես ամսական գրանցված user-ների ընդհանուր թիվը, օրինակ օգոստոսին 20 յուզեռ և այլն: 2022 թ․ նոյեմբերի 15 դրությամբ ցույց է տալիս 2021թ․-ի դեկտեմբերի 1-ից մինչ 2022թ․-ի նոյեմբերի 15-ը ընկած ժամանակահտվածում ստեղծված user-ները ըստ ամիսների
router.get("/stats/", verifyTokenAndAdmin, async (req, res) => {
	const date = new Date();//սա մեզ վերադարձնում է ընթացիկ տարին ամիսը օրը ժամը(Mon Nov 14 2022 23:30:43 GMT+0400 (Армения, стандартное время))
	//մենք սահմանափակելու ենք այս վիճակագրությունը որովհետև մեզ չի հետաքրքրում օրինակ անցյալ տարվա ցուցանիշները
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));//սա վերադարձնում է անցած տարվա նույն օրը և ժամը(Sun Nov 14 2021 23:30:43 GMT+0400 (Армения, стандартное время)
	//մեզ անհրաժեշտ է լինելու ամսական կտրվածքով user-ների վիճակագրություն, դրա համար մենք պետք է խմբավորենք մեր տարրերը դրա համար մենք օգտագործում ենք MONGODB aggregate
	try {//Aggregation-ը խմբավորում է բազմաթիվ փաստաթղթերի տվյալները և տրամադրում է ամփոփված արդյունքները, միջին արժեքը մեծ արդյունքների հավաքածուից, min/max արժեքը մեծ արդյունքների հավաքածուից և այլն:
	  const data = await User.aggregate([//Ագրեգացումը գործողություն է, որը մշակում է տվյալները՝ հաշվարկված արդյունք տալու համար: Ագրեգացման գործողությունները միավորում են արժեքները մի քանի փաստաթղթերից և կարող են մի շարք գործողություններ կատարել խմբավորված տվյալների վրա՝ մեկ արդյունք վերադարձնելու համար: Այն ներառում է փուլեր կամ խողովակաշարեր, որոնց միջոցով տվյալները մշակվում են համակցված արդյունք ստանալու համար:
		{ $match: { createdAt: { $gte: lastYear } } },//Ամսաթվի համընկնման համար օգտագործեք $match։մենք վերցնում ենք այօրվանից քիչ և անցած տարվանից շատ ընկած ժամանակահատվածը։MongoDB-ն տրամադրում է տարբեր տեսակի համեմատական ​​օպերատորներ, և դրանցից մեկն է օպերատորին ($gte) ավելին: Այս օպերատորն օգտագործվում է այն փաստաթղթերը ընտրելու համար, որտեղ դաշտի արժեքը մեծ է, քան (>=) տրված արժեքին:
		{
		  $project: {// $project-ը թույլ է տալիս նշել, թե ինչ դաշտեր եք ցանկանում վերադարձնել ձեր ագրեգացիայի կողմից վերադարձված փաստաթղթերում:
			month: { $month: "$createdAt" },// այստեղ ստեղծում ենք month փոփոխական և սահմանում ենք վերցրեք ամսվա($month) համարը(օրինակ մարտը ամսվա համարը 3-ն է, այդ տրամաբանությամբ),այդ ամսաթվի միջակայքում ստեղծված՝ $createdAt (որը սահմանել ենք դա այն միջակայքն է որ այս օրվանից քիչ և անցած տարվանից շատ ընկած ժամանակահատվածն է), այսինքն եթե user-ը գրանցվել է մարտին կվերցնի 3-ը և կվերագրի month:-ին։ ասվում է նաև եթե month:-ի փոխարեն վերցնեք year այդ ժամանակ կվերադարձնի 2022
		  },
		},
		{
		  $group: {//$group-ը Խմբավորում է փաստաթղթերն ըստ որոշակի արտահայտության և հաջորդ փուլ դուրս բերում փաստաթուղթ յուրաքանչյուր առանձին խմբավորման համար: Ելքային փաստաթղթերը պարունակում են _id դաշտ։_id դաշտը պարտադիր է . Այնուամենայնիվ, դուք կարող եք նշել _id արժեքը null-ի համար, որպեսզի հաշվարկեք կուտակված արժեքները բոլոր մուտքային փաստաթղթերի համար որպես ամբողջություն:Ինչպես ենթադրում է անունը, $groupօպերատորը խմբավորում է նմանատիպ տվյալներ ըստ որոշակի արտահայտության և միավորում դրանք մեկ արդյունքի կամ փաստաթղթի մեջ:Ենթադրենք տվյալների բազայում կա 15 մարդ, և նրանք բոլորն ունեն նմանատիպ հոբբի: Եթե ​​ցանկանում ենք հաշվել բոլոր այն մարդկանց, ովքեր ունեն ընդհանուր հոբբի, ապա $groupօպերատորը էլեգանտ լուծում է նման առաջադրանքի համար։
			_id: "$month",//սա վերևում սահմանված month:-ն է որը ցույց է տալիս տվյալ ամսվա համարը
			total: { $sum: 1 },//$sum մեթոդով մենք կստանանք տվյալ ամսվա ընթացքում գրանցված user-ների քանակը,գրում ենք 1 որ այն գումարի յուրաքանչյուր գրանցված user-ին
		  },
		},
	  ]);
	  res.status(200).json(data)
	} catch (err) {
	  res.status(500).json(err);//եթե առկա լինի որևէ խնդիր, մենք կուղարկենք էռոռ՝ err
	}
  });


module.exports = router; 



