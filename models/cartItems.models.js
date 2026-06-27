import mongoose, { Schema } from "mongoose";

const cartItemsSchema = new mongoose.Schema ({
    quantity : {required : true , type : String},
    cart : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cart",
        required : true , 
    },
     item : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Item",
        required : true , 
    },
}, {timestamps : true });

export default mongoose.model("CartItem" , cartItemsSchema);