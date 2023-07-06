import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        lowercase : true
    }
})

export default mongoose.model("Category" , categorySchema);