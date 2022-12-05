//User model

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },//required: true-սա նշանակում է որ առանց user-ի(օգտվող) անվան մենք չենք կարող որևէ օգտվող ստեղծել,unique: true-սա նշանակում է որ մենք չենք կարող ստեղծել մեկ այլ user նույն username-ով(այսինքն եթե մեկը գրանցվել է օրինակ RubenOOO username-ով մեկ ուրիշը չի կարոց գրանցվել այդ նույն անվամբ )
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);


