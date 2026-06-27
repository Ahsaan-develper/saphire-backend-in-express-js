import mongoose, { Schema } from "mongoose";

const imgSchema = new mongoose.Schema({
    uri : {type : String , required : true  },
    publicId: { type: String, required: true },
    role : {
        type : String , required : true,
        enum : ["front" , "back" , "middle" , "side"]
    },
    item : {
        type : mongoose.Schema.Types.ObjectId,
    ref : "Item",
        required : true,
    },
} , {timestamps : true});

export default mongoose.model("Images"  , imgSchema );