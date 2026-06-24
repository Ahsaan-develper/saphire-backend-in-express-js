import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    method : {type : String , required : true},
    billing_address : {type : String , required : true},
     order : {
        type : Schema.Types.ObjectId,
        ref : "Order",
        required : true,
    },
} , { timestamps : true });


export default mongoose.model("Payment" , paymentSchema);