import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
     order : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Order",
        required : true
    },
     item : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Item",
        required : true
    }
})