const express = require("express")
const router = express.Router()
const authController = require('../Controller/authController')
const upload = require('../middleWare/upload')
router.post('/loginGG',authController.loginGG )
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/changeProfile2',authController.changeProfile2)
router.post('/changeProfile1',upload.single('image'),authController.changeProfile1)
router.post('/insertPost',upload.array('file',12), authController.insertPost)// vì upload bằng ajax formdata nên tên 'file' là tên đặt trong formdata chứ ko phải tên name=" "trong input 
router.post('/deletePost', authController.deletePost)
router.post('/updatePost',upload.array(('file'),12),authController.updatePost)
router.post("/changePassword", authController.changePassword)
module.exports=router