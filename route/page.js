const express = require("express")
const router = express.Router()
const post = require('../models/post')
const {OAuth2Client} = require('google-auth-library');
const authenticate= require('../middleWare/authenticate');
const accountStudent = require("../models/accountStudent");
const accountF = require('../models/account')
const notification = require('../models/notification')
const checkAuthen = require("../middleWare/checkAuthenGG")
const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


router.get("/",checkAuthen,(req,res)=>{
    let user = req.user

    post.find({},(err, doc)=>{
        if(err)
            console.log(err);
        else 
        {
            let token = req.cookies['session-token']
            if(token!==undefined){
                
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
                    accountStudent.findOne({email: user.email},(err, docs)=>{
                        //console.log(doc);
                        res.render('index',{doc,docs})
                    })
                    
                })
            }
            else {
                let email = req.cookies.account;
                accountF.findOne({email:email},(err, docs)=>{
                    res.render('index',{doc,docs})
                })
        }
        } 
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
    res.clearCookie('jwt');
    res.clearCookie('account')
    res.redirect('/login')
})
router.get('/admin',checkAuthen,(req,res)=>{
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
router.get('/profile',checkAuthen,(req,res)=>{
    let token = req.cookies['session-token']
    if(token!==undefined){
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
         
           accountStudent.findOne({email: user.email},(err, doc)=>{
            //console.log(user.email);
               post.find({email:user.email},(error,docs)=>{
                  // console.log("doc,",docs.image.length);
                   if(error){
                       console.log(error);
                   }
                   else 
                res.render('profile',{doc,docs})
               })
               //console.log(doc);
              
           })
          
       })
    }
    else {     let email = req.cookies.account;
        accountF.findOne({email:email},(err, doc)=>{
            post.find({email:email},(error,docs)=>{
                // console.log("doc,",docs.image.length);
                 if(error){
                     console.log(error);
                 }
                 else 
              res.render('profile',{doc,docs})
             })
        })}
            
})

router.get('/edit-account',(req,res)=>{
    
    let token = req.cookies['session-token']
    if(token!==undefined){
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
       // console.log("dã vao duoi");
        var email = req.cookies.account// 2 cách lấy  cookie 1 giống bên  if 2 là dùng . giống ở đây
        console.log("email:",email);
        accountF.findOne({email: email},(err,doc)=>{
            res.render('edit-account',{doc})
        })
    }
  
})

router.get('/createNotification',checkAuthen,(req,res)=>{
    var token =  req.cookies.jwt;
    if(token){
        var email = req.cookies.account
        console.log("email",email);
        accountF.findOne({email: email},(err, info)=>{
            console.log(info.faculty);
            res.render('create-notfication',{info})
        })
       /* .then(info=>{
            
        })
        .catch(e=>console.log(e))*/

    }
    else res.redirect('/')
    
})

router.get('/notification',checkAuthen,(req,res)=>{
    notification.find({},(err, doc)=>{
        res.render('department-notfication',{doc})
    })

})

router.get('/CTHSSV',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"})
    })
})

router.get('/KhoaCntt',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Công nghệ thông tin"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Công nghệ thông tin"})
    })
})

router.get('/TTTH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm tin học"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm tin học"})
    })
})

router.get('/SDTC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"})
    })
})

router.get('/ATEM',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"})
    })
})

router.get('/TTHTDN',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"})
    })
})

router.get('/TTNNTH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"})
    })
})

router.get('/VCS',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Viện chính sách kinh tế và kinh doanh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Viện chính sách kinh tế và kinh doanh"})
    })
})

router.get('/Khoa luật',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa luật"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa luật"})
    })
})

router.get('/KhoaMyThuatCongNgiep',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Mỹ thuật công nghiệp"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Mỹ thuật công nghiệp"})
    })
})

router.get('/KhoaDien',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Điện-điện tử"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Điện-điện tử"})
    })
})

router.get('/KhoaQTKD',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Quản trị kinh doanh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Quản trị kinh doanh"})
    })
})

router.get('/KhoaMoiTruong',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Môi trường và bảo hộ lao động"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Môi trường và bảo hộ lao động"})
    })
})

router.get('/KhoaLDCD',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Lao động công đoàn"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Lao động công đoàn"})
    })
})

router.get('/KhoaGDQT',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa giáo dục quốc tế"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa giáo dục quốc tế"})
    })
})

router.get('/KhoaTCNH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Tài chính ngân hàng"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Tài chính ngân hàng"})
    })
})

router.get('/PhongDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Đại học"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Đại học"})
    })
})

router.get('/PhongSauDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Sau đại học"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Sau đại học"})
    })
})

router.get('/PhongDienToanMayTinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng điện toán và máy tính"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng điện toán và máy tính"})
    })
})

router.get('/PhongKhaoThi',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng khảo thí và kiểm định chất lượng"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng khảo thí và kiểm định chất lượng"})
    })
})

router.get('/PhongTaiChinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng tài chính"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng tài chính"})
    })
})

router.get('/PhongLC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"TDT Creative Language Center"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"TDT Creative Language Center"})
    })
})

 module.exports= router