const User = require("../models/User");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

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
		res.status(500).json("something went wrong please try again");
	}
});


//Delete user

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User has been deleted...");
	} catch (err) {
		res.status(500).json("something went wrong please try again");
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
		res.status(500).json("something went wrong please try again");
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
		res.status(500).json("something went wrong please try again");
	}
});


//GET USER STATS-ADMIN-ը ստանում է user-ների վիճակագրությունը ամսվա կտրվածքով 

router.get("/stats/", verifyTokenAndAdmin, async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: "$createdAt" },
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: 1 },
				},
			},
		]);
		res.status(200).json(data)
	} catch (err) {
		res.status(500).json("something went wrong please try again");
	}
});


module.exports = router;



