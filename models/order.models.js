import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    orderStatus : {
        type : String , required : true ,
        enum : ["pending" , "cancel" ,"completed"],
    },
    totalPrice : {  type : Number , required : true },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User",
        required : true
    },
} , {timestamps : true});

export default mongoose.model("Order" ,orderSchema);