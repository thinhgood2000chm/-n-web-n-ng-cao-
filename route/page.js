const express = require("express")
const router = express.Router()
const post = require('../models/post')
const {OAuth2Client} = require('google-auth-library');
const authenticate= require('../middleWare/authenticate');
const accountStudent = require("../models/accountStudent");
const account = require('../models/account')
const checkAuthen = require("../middleWare/checkAuthenGG")
const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


router.get("/",checkAuthen,(req,res)=>{
    //let user = req.user
    post.find({},(err, doc)=>{
        if(err)
            console.log(err);
        else   res.render("index",{doc})
    })
  
})
router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get("/login",(req,res)=>{
    res.render("login")
})

router.get('/logout',(req,res)=>{
    res.clearCookie("session-token");
    res.redirect('/login')
})
router.get('/admin',authenticate,(req,res)=>{
    res.render("admin")
})

router.get('/error',(req,res)=>{
    let user = req.user
    res.render('error')
})

router.get('/admin/Account',(req,res)=>{
    res.render('admin-account')
})

//router của sv 
router.get('/student/profile',checkAuthen,(req,res)=>{
    let token = req.cookies['session-token']
    let user = {}
     async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: token,
             audience: CLIENT_ID,  
         });
         const payload = ticket.getPayload();
             user.email= payload.email;
       }
       verify().then(()=>{
           console.log(user.email);
           accountStudent.find({email: user.email},(err, doc)=>{
               //console.log(doc);
               res.render('profile',{doc})
           })
          
       })
            
})

router.get('/user/notification',(req,res)=>{
    res.render('department-notfication')
})
router.get('/edit-account',(req,res)=>{
    
    let token = req.cookies['session-token']
    if(token!==''){
    //console.log("da vao ");
    let user = {}
     async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: token,
             audience: CLIENT_ID,  
         });
         const payload = ticket.getPayload();
             user.email= payload.email;
       }
       verify().then(()=>{
           //console.log(user.email);// user email lấy ở bên trên 
           accountStudent.findOne({email: user.email},(err, doc)=>{
               //console.log(doc.fullname);
               res.render('edit-account',{doc})
           })
          
       })
    }
    else {
        email = req.cookies.email// 2 cách lấy  cookie 1 giống bên  if 2 là dùng . giống ở đây
        account.find({email: email},(err,doc)=>{
            res.render('edit-account',{doc})
        })
    }
  
})

/*
function checkAuthen(req,res,next){
    // var token = req.body.token
    let token = req.cookies['session-token']
    let user = {}
     async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: token,
             audience: CLIENT_ID,  
         });
         const payload = ticket.getPayload();
             user.name = payload.name;
             user.email= payload.email;
             user.picture = payload.picture;
             console.log(payload);
       }
       verify().then(()=>{
             req.user=user;     
             next();
       }).catch(err=>{
           res.redirect("/login")
       });
 }
*/
 module.exports= router