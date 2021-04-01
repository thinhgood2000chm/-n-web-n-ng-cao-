const jwt = require("jsonwebtoken");
const {JWT_SECRET}= process.env
 const authenticate=(req,res,next)=>{
         
        const token = req.cookies.jwt;
        if(token){
            jwt.verify(token,JWT_SECRET,(err, decode)=>{
                if(err){
                    console.log("chay vao day");
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

 module.exports= authenticate