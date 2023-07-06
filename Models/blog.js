import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title : String,
    text : String,
    image : String,
    like : Number,
    views : Number,
    time : Date,
    categories : [{type : mongoose.Schema.Types.ObjectId , ref : 'Category'}],
    author : {type : mongoose.Schema.Types.ObjectId , ref : 'User'}
})

export default mongoose.model('Blog',blogSchema)