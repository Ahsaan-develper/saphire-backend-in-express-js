import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    title : {type : String , required : true},
    price : {type : Number , required : true},
    description : {type : String , required : true},
    fabricType : {
        type : String , required : true,
        enum : ["new arrival" , "winter collection" ,
            "silk collection" , "velvet collection" ,
             "karandi collection" , "khaddar collection" ,
             "summer collection" , "printed lawn collection"]
    },
    product_type :  {
        type : String , required : true,
        enum : ["stitch" , "unstitch"]
    },
    
} , {timestamps : true});

export default mongoose.model("Item" , itemSchema);