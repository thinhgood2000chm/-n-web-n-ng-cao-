const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const jwt = require("jsonwebtoken");
const {JWT_SECRET}= process.env

function checkAuthen(req,res,next){
    // var token = req.body.token
    let token = req.cookies['session-token']
    console.log(token);
    if(req.cookies['session-token']!==undefined){
        //console.log("đẫ đi vào chỗ này");
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
 else {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,JWT_SECRET,(err, decode)=>{
            if(err){
                //console.log("chay vao day");
                res.redirect('/login')
            }
            else {
                console.log(decode);
                next()
            }
        })
    }
    else  res.redirect('/login')

 }
}

 module.exports= checkAuthen