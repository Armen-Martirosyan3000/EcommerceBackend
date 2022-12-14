//User model

const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		lastname: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true, validate: [validator.isEmail, "not email"] },
		password: { type: String, required: true },
		confirmpassword: { type: String, required: true },
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);





































