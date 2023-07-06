import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email : {
        type : String,
        lowercase : true
    },
    fname : String,
    lname : String,
    dob : Date,
    doc : Date,
    password : String,
    salt : String
})

export default mongoose.model('User' , userSchema)