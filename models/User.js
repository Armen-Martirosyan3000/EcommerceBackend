const mongoose = require("mongoose");

//ստեղծում ենք օգտվողի սխեման
const UserSchema = new mongoose.Schema(
	{
	  username: { type: String, required: true, unique: true },//required: true-սա նշանակում է որ առանց user-ի(օգտվող) անվան մենք չենք կարող որևէ օգտվող ստեղծել,unique: true-սա նշանակում է որ մենք չենք կարող ստեղծել մեկ այլ user նույն username-ով(այսինքն եթե մեկը գրանցվել է օրինակ RubenOOO username-ով մեկ ուրիշը չի կարոց գրանցվել այդ նույն անվամբ )
	  email: { type: String, required: true, unique: true },
	  password: { type: String, required: true },
	  isAdmin: {
		type: Boolean,//Admin-ի type Boolean է որովհետև դա կլինի ճշմարիտ կամ կեղծ և
		default: false,//default կարող ենք գրել այստեղ ցանկացած default արժեք և այն false կլինի, երբ մենք ստեղծենք նոր user այն չի լինի Admin(ադմինիստրատոր) 
	  },
	},
	{ timestamps: true }//այս կոդով մենք ֆիքսում ենք(գրում ենք) user-ի գրանցման(ստեղծման) ամսաթիվը այսպես՝ createdAt: Date.now() որը կվերցնի ընթացիկ ամսաթիվը, սակայն կարիք չկա այս կոդը գրել քանի որ մենք օգտագործում ենք mongoose որը մեզ հնարավորություն է տալիս այս գործառույթի համար այստեղ պարզապես գրում ենք՝ { timestamps: true } Եթե ​​սահմանեք , Mongoose-ը ձեր սխեմային timestamps: trueկավելացնի տիպի երկու հատկություն .Date 1) createdAt: ամսաթիվ, որը ցույց է տալիս, թե երբ է ստեղծվել այս փաստաթուղթը 2)updatedAt: ամսաթիվ, որը ցույց է տալիս, թե երբ է այս փաստաթուղթը վերջին անգամ թարմացվել
  );
  
  module.exports = mongoose.model("User", UserSchema);