const mongoose = require('mongoose');
const { Schema } = mongoose

const postSchema = new Schema({
    name: {type:String,required:true},
    location:{type:String,required:true},
    likes:{type:Number,required:true},
    description:{type:String,required:true},
    date:{type:String,required:true},
    PostImage: {type:String,required:true},
    user: {type: mongoose.Types.ObjectId ,ref:'User'}
})

const Post = mongoose.model('Posts',postSchema)

module.exports = Post;