const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String},
    image:{type:String, required:true},
    year:{type:Number, required:true},
    tags:{type:[String]}
})

module.exports = mongoose.model("posts", postSchema )