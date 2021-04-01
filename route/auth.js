const express = require("express")
const router = express.Router()
const authController = require('../Controller/authController')

router.post('/loginGG',authController.loginGG )
router.post('/signup', authController.signup)
router.post('/login', authController.login)

  
module.exports=router