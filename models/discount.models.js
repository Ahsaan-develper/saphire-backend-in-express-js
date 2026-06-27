import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    name : {  type : String , required : true },
    startAt : {  type : Date , required : true },
    endAt : {  type : Date , required : true },
    discountValue : {  type : Number , required : true , min :0 },
    type : {  type : String , required : true,
    enum: ["percentage", "fixed"] 
    },
      fabricType : {
        type : String , required : true,
        enum : ["new arrival" , "winter collection" ,
            "silk collection" , "velvet collection" ,
             "karandi collection" , "khaddar collection" ,
             "summer collection" , "printed lawn collection"]
    },
    isActive : {  type : Boolean , default : true },

} , {timestamps  : true})

export default mongoose.model("Discount" , discountSchema);