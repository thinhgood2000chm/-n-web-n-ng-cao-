const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    email: String,
    name: String,
    message: String,
    comment: [{
        emailUComment: String,
        content: String,
    }]
},{timestamps:true})
const post = mongoose.model("post",postSchema,"post")

module.exports= post