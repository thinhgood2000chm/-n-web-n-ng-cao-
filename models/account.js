const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    faculty: String,
    email:{
        type :String 
    },
    password:String
},{timestamps: true})

const account = mongoose.model("account", accountSchema, 'account')

module.exports = account