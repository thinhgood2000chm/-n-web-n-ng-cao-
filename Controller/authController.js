const account = require('../models/account')
const accountStudent = require('../models/accountStudent')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require('fs');
const {OAuth2Client} = require('google-auth-library');
const {JWT_SECRET}=process.env
const post = require("../models/post")
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
               accountStudent.find({},(err,doc)=>{
            
                    if(doc.length===0){
                        //console.log("dã vao day null ");
                        let newAccountStudent = new accountStudent({
                            iss: payload.iss,
                            hd: payload.hd,
                            fullname: payload.name,
                            email: payload.email, 
                            picture: payload.picture,
                            given_name: payload.given_name,
                            family_name: payload.family_name,
                            })
                            newAccountStudent.save()
                            //.then(()=>console.log("thêm tài khoản sv thành công ")).catch(e=>console.log(e))
                    }
                    else if(doc.length>0){
                        for(var i =0;i<doc.length;i++){
                            if(doc[i].email===payload.email){
                            //console.log("doc",doc);
                            //console.log("dã vao day");
                            return true
                        }
                    }
                    }
                        
                     
                        else{
                            //console.log("dã vao day 2");
                            let newAccountStudent = new accountStudent({
                                iss: payload.iss,
                                hd: payload.hd,
                                fullname: payload.name,
                                email: payload.email, 
                                picture: payload.picture,
                                given_name: payload.given_name,
                                family_name: payload.family_name,
                                })
                                newAccountStudent.save()
                                .then(()=>console.log("thêm tài khoản sv thành công ")).catch(e=>console.log(e))
                        }
                    
                })
               
                return true
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

// thay đổi thông tin cá nhân 
exports.changeProfile2= (req, res)=>{
    var {firstname, lastname , email , className ,faculty} = req.body
    console.log(firstname, lastname , email , className ,faculty);

    let updateData = {
        given_name: firstname,
        family_name:lastname,
        className: className,
        faculty : faculty
    }
    // trong đồ án môn esdc thì dùng cách promise còn trong này dùng function đều theo kiểu es6
    accountStudent.findOneAndUpdate({email:email},{$set:updateData},(err)=>{
        if(err)
            console.log(err);
        else {
            console.log(" cập nhật dữ liệu thành công");
            res.redirect('/edit-account')
        }
    })

}

exports.changeProfile1=(req,res)=>{

    images = req.file;
    //console.log("image",images)
    pathImage= `public/upload/${images.originalname}`
   // console.log(image);
    fs.renameSync(images.path,pathImage)
    var image = pathImage.slice(6)

    var {email,username, biography} = req.body
    console.log(username, biography, email);
    let updateData = {
        fullname: username, 
        picture : image,
        biography:biography
    }
    accountStudent.findOneAndUpdate({email:email},{$set:updateData})
    .then(()=>{
        console.log(" cập nhật trên thành công ");
        res.redirect('/edit-account')
    })
    .catch(e=>console.log(e))
}

// tạo bài viết ( thêm dữ liệu vào database)
exports.insertPost=(req,res)=>{
    var {nameUser,hiddenEmailOfPost, messageText}= req.body
    console.log(nameUser,messageText,hiddenEmailOfPost);
    let newPost = new post({
        email: hiddenEmailOfPost,
        name: nameUser,
        message:messageText,

    })
    newPost.save()
   
        //console.log(" thêm bài viết thành công")
        .then(()=>{
            console.log(" them data thanh cong");
        })
    
    .catch(e=>console.log(e))
    
    res.setHeader('Content-Type', 'application/json');
    res.send({
        code: 0, 
    
        data: {
            email: hiddenEmailOfPost,
            name: nameUser,
            message:messageText,
        }
    });

 
}
