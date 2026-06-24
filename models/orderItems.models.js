import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
     order : {
        type : Schema.Types.ObjectId,
        ref  : "Order",
        required : true
    },
     item : {
        type : Schema.Types.ObjectId,
        ref  : "Item",
        required : true
    }
})