const express = require("express")
const router = express.Router()
const {OAuth2Client} = require('google-auth-library');
const authenticate= require('../middleWare/authenticate')
const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


router.get("/",checkAuthen,(req,res)=>{
    let user = req.user
    res.render("index",{user})
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

 module.exports= router