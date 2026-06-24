import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    status : {
        type : String , required : true ,
        enum : ["pending" , "cancel" ,"completed"],
    },
    totalPrice : {  type : String , required : true },
    user : {
        type : Schema.Types.ObjectId,
        ref  : "User",
        required : true
    }
} , {timestamps : true});

export default mongoose.model("Order" ,orderSchema);