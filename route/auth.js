const express = require("express")
const router = express.Router()
const authController = require('../Controller/authController')
const upload = require('../middleWare/upload')
router.post('/loginGG',authController.loginGG )
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/changeProfile2',authController.changeProfile2)
router.post('/changeProfile1',upload.single('image'),authController.changeProfile1)
router.post('/insertPost', authController.insertPost)
  
module.exports=router