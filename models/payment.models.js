import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    method : {type : String , required : true,
        enum : ["bank" , "cashondelivery"]
    },
    billingAddressType : {type : String , required : true,
        enum : ["same" , "other"]
    },
    
    billingAddress : { type : String , required : true},
     order : {  
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
        required : true,
    },
} , { timestamps : true });


export default mongoose.model("Payment" , paymentSchema);