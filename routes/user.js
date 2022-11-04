const router=require("express").Router();

router.get("", (req,res)=>{
	res.send("user test is successfull")
})

module.exports = router;