import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    guestId : { type : String  ,  default : null }
} , {timestamps : true});

export default mongoose.model("Cart" , cartSchema);