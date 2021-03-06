const express = require("express")
const router = express.Router()
const post = require('../models/post')
const {OAuth2Client} = require('google-auth-library');
const authenticate= require('../middleWare/authenticate');
const accountStudent = require("../models/accountStudent");
const accountF = require('../models/account')
const notification = require('../models/notification')
const checkAuthen = require("../middleWare/checkAuthenGG")
const authController = require('../Controller/authController')
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

router.get('/error-page',(req,res)=>{
    let user = req.user
    res.render('error')
})

router.get('/admin/Account',(req,res)=>{
    res.render('admin-account')
})

//router c???a sv 
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
           //console.log(user.email);// user email l???y ??? b??n tr??n 
           accountStudent.findOne({email: user.email},(err, doc)=>{
               //console.log(doc.fullname);
               res.render('edit-account',{doc})
           })
          
       })
    }
    else {
       // console.log("d?? vao duoi");
        var email = req.cookies.account// 2 c??ch l???y  cookie 1 gi???ng b??n  if 2 l?? d??ng . gi???ng ??? ????y
        console.log("email:",email);
        accountF.findOne({email: email},(err,doc)=>{
            res.render('edit-account',{doc})
        })
    }
  
})
// t???o th??ng b??o
router.get('/createNotification',checkAuthen,(req,res)=>{
    var token =  req.cookies.jwt;
    if(token){
        var email = req.cookies.account
        console.log("email",email);
        accountF.findOne({email: email},(err, info)=>{
            notification.find({email:email},(err, infoNoti)=>{
                console.log(info.faculty);
                res.render('create-notfication',{info, infoNoti})
            })
         
        })

    }
    else res.redirect('/')
    
})
// ch???nh s???a th??ng b??o
//router.get("/deleteNoti/:id",authController.deleteNoti)




router.get('/notification',checkAuthen,(req,res)=>{
    notification.find({},(err, doc)=>{
        res.render('department-notfication',{doc})
    })

})

router.get('/CTHSSV',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng C??ng t??c h???c sinh sinh vi??n (CTHSSV)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng C??ng t??c h???c sinh sinh vi??n (CTHSSV)"})
    })
})

router.get('/KhoaCntt',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa C??ng ngh??? th??ng tin"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa C??ng ngh??? th??ng tin"})
    })
})

router.get('/TTTH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung t??m tin h???c"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung t??m tin h???c"})
    })
})

router.get('/SDTC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung t??m ????o t???o ph??t tri???n x?? h???i (SDTC)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung t??m ????o t???o ph??t tri???n x?? h???i (SDTC)"})
    })
})

router.get('/ATEM',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung t??m ph??t tri???n Khoa h???c qu???n l?? v?? ???ng d???ng c??ng ngh??? (ATEM)"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung t??m ph??t tri???n Khoa h???c qu???n l?? v?? ???ng d???ng c??ng ngh??? (ATEM)"})
    })
})

router.get('/TTHTDN',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung t??m h???p t??c doanh nghi???p v?? c???u sinh vi??n"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung t??m h???p t??c doanh nghi???p v?? c???u sinh vi??n"})
    })
})

router.get('/TTNNTH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung t??m ngo???i ng??? - tin h???c ??? b???i d?????ng v??n h??a"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung t??m ngo???i ng??? - tin h???c ??? b???i d?????ng v??n h??a"})
    })
})

router.get('/VCS',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Vi???n ch??nh s??ch kinh t??? v?? kinh doanh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Vi???n ch??nh s??ch kinh t??? v?? kinh doanh"})
    })
})

router.get('/Khoa lu???t',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa lu???t"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa lu???t"})
    })
})

router.get('/KhoaMyThuatCongNgiep',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa M??? thu???t c??ng nghi???p"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa M??? thu???t c??ng nghi???p"})
    })
})

router.get('/KhoaDien',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa ??i???n-??i???n t???"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa ??i???n-??i???n t???"})
    })
})

router.get('/KhoaQTKD',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Qu???n tr??? kinh doanh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Qu???n tr??? kinh doanh"})
    })
})

router.get('/KhoaMoiTruong',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa M??i tr?????ng v?? b???o h??? lao ?????ng"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa M??i tr?????ng v?? b???o h??? lao ?????ng"})
    })
})

router.get('/KhoaLDCD',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Lao ?????ng c??ng ??o??n"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Lao ?????ng c??ng ??o??n"})
    })
})

router.get('/KhoaGDQT',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa gi??o d???c qu???c t???"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa gi??o d???c qu???c t???"})
    })
})

router.get('/KhoaTCNH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa T??i ch??nh ng??n h??ng"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa T??i ch??nh ng??n h??ng"})
    })
})

router.get('/PhongDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng ?????i h???c"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng ?????i h???c"})
    })
})

router.get('/PhongSauDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng Sau ?????i h???c"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng Sau ?????i h???c"})
    })
})

router.get('/PhongDienToanMayTinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng ??i???n to??n v?? m??y t??nh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng ??i???n to??n v?? m??y t??nh"})
    })
})

router.get('/PhongKhaoThi',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng kh???o th?? v?? ki???m ?????nh ch???t l?????ng"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng kh???o th?? v?? ki???m ?????nh ch???t l?????ng"})
    })
})

router.get('/PhongTaiChinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Ph??ng t??i ch??nh"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Ph??ng t??i ch??nh"})
    })
})

router.get('/PhongLC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"TDT Creative Language Center"},(err,doc)=>{
        res.render("department-notfication",{doc,faculty:"TDT Creative Language Center"})
    })
})



 module.exports= router