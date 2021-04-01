const account = require('../models/account')
const accountStudent = require('../models/accountStudent')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {OAuth2Client} = require('google-auth-library');
const {JWT_SECRET}=process.env

const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

exports.loginGG= (req,res)=>{
    let token = req.body.token
    //console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
 
        if(payload.email.includes('@student.tdtu.edu.vn')){// gặp tk đúng yêu cầu thì thêm tk sau đó trả về true 
            if(payload.email){
                accountStudent.find({email: payload.email},(err,doc)=>{
                    if(doc[0].email ===payload.email){
                        return true
                    }
                })
                return true
            }
            else{ let newAccountStudent = new accountStudent({
                iss: payload.iss,
                hd: payload.hd,
                fullname: payload.fullname,
                email: payload.email, 
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,

                })
                newAccountStudent.save()
                //then(()=>console.log("thêm tk sv thành công")).catch(e=> console.log(e))
                return true // true sẽ trả về ở result}

            }
               

        }
    }
    verify().then((result)=>{
        if(result){// result trả về true 
            console.log('result',result);
            res.cookie("session-token",token)
            res.send("success")
        }
        else res.send("fail")

      }).catch(console.error);

    
}

exports.signup=(req,res)=>{
    var{faculty,email, password,passwordComfirm}= req.body;

    bcrypt.hash(password, 10, (err, hashedPass)=>{
        if(err){
            res.json({
               error:err
            })
        }
       
            let newAccount = new account({
                faculty : faculty,
                email: email,
                password: hashedPass
            })
            newAccount.save()
            .then(()=>{
                res.redirect('/login')
            })
            .catch(e=>console.log(e))
    
    })
}


exports.login=(req,res,next)=>{
    var{email , password}= req.body;
   
    if(!email){
      res.render('login',{errMess:'vui lòng nhập email'})
    }
    else if (!password){
    res.render('login',{errMess:"vui long nhap password",email,password})
    }
    else if (password.length<6 ){
        res.render('login',{errMess:"vui long nhap toi thieu 6 kis tu",email,password})
    }
    else{
    account.findOne({email:email})
    .then(account=>{
        if(account){
            bcrypt.compare(password,account.password,(err, result)=>{
                if(err){
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token = jwt.sign({id: account._id},JWT_SECRET,{expiresIn:'1h'})
                    res.cookie('jwt', token)
                    res.cookie('account',account.email)
           
                    if(account.email.includes("thinh")){
                        res.redirect("/admin")
                    }
                    else res.redirect('/index')// chỗ này chưa sửa cho từng khoa
                }
                else {
           
                    res.render('login',{errMess:"mật khẩu không trùng khớp",email,password})
                }
            })
        }
        else{
   
            res.render('login',{errMess:"email không tồn tại",email,password})
        }
    })

}
}
