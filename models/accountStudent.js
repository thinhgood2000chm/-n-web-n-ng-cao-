const mongoose = require('mongoose');
const Schema = mongoose.Schema

const accountStudentSchema = new Schema({
    iss: String,
    hd: String,
    fullname: String,
    email:{
        type:String,
        unique: true
    }, 
    picture: String,
    given_name: String,
    famly_name: String,
    class: String,
    faculty: String
},{timestamps: true})
const accountStudent = mongoose.model('accountStudent', accountStudentSchema, 'accountStudent')
module.exports= accountStudent