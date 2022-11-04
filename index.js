//mongo.db-ում տալիս ենք IP հասցե որ կարողանանք կարդալ մեր տվյալների բազան, մենք դրել ենք՝ 0․0․0․0, դա նշանակում է որ յուրաքանչյուր սերվեր կարող է հասնել մեր db-ին, քանի որ մենք աշխատում ենք localhost-ի վրա կարող ենք այն թողնել այդպես, բայց եթե մենք տեղակայում ենք մեր հավելվածը, պետք է չափորոշենք սերվերի IP-ն։
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv=require("dotenv");//.env ֆայլն օգտագործելու այսպես ներմուծում ենք dotenv-ն 
dotenv.config();//.env
const userRoute = require("./routes/user");//այստեղով require(պահանջում ենք, ներմուծում ենք) routes պապկայի user․js ֆայլը և այն դնում ենք userRoute փոփոխականի մեջ

mongoose
	.connect(process.env.MongoUrl)//mongoose-ով մենք միացնում ենք մեր հավելվածը mongodb-ին:Link-ը վերցնում եմ mongodb-ից, որի մեջ 2 փոփոխություն եմ անում <password>-ի փոխարեն գրում եմ իմ userName(mongodb-ում գրանցված) և ավելացնում եմ shop(db-ի անունը, որը դնում ենք ասենք shop)		
	.then(() => console.log("DB Connection Successfull!"))// սա նշանակում է եթե հաջողվի console.log կանի DB Connection Successfull-DB կապը հաջող է
	.catch((err) => {//իսկ եթե սխալ լինի console.log(err) կանի err
		console.log(err);
	});

	app.use("/api/user",userRoute)//այստեղի՝ /api/user



app.listen(process.env.PORT || 7000, () => {//սա նշանակում է որ եթե մեր .env ֆայլում PORT-ի համար չկա օգտագործենք 7000-ը
	console.log("Backend server is running!")
});