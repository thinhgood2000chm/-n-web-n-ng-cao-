const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notifySchema = new Schema({
    faculty: String, 
    title: String,
    content: String,
    email:String,
    image: [String]

},{timestamps:true})

const notification = mongoose.model('notification', notifySchema,'notification')

module.exports= notification