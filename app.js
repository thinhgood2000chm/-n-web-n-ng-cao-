require('dotenv').config()
const express = require("express")

const cookieParser = require("cookie-parser")
const mongoose= require("mongoose")
const morgan = require("morgan")
const app = express()

//khai bao cua gg 
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
// kết thúc khai báo gg 
app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use('/public',express.static('public'))
app.use('/',require('./route/page'))

app.use('/',require('./route/auth'))

mongoose.connect("mongodb://localhost:27017/DoAnWebNangCao",
    {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true}
)

const db = mongoose.connection;
db.on("error",(err)=>{
    console.log(err);
})

db.once('open',()=>{
    console.log(" database  da duoc ket noi");
})
app.use(morgan('dev'))
app.listen(3000,(req,res)=>{
    console.log("server is running on port 3000");
}) 


