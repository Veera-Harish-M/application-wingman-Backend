const express =require("express")
const router= express.Router()

//controllers
const {signIn} = require("../controllers/signin")
const {signInValidator} = require("../validators/user")

router.post("/signin",signInValidator,signIn);


module.exports = router; 