import mongoose from "mongoose";
const item_discountSchema = new mongoose.Schema({
    item : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Item",
            required : true,
        },
    discount : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Discount",
            required : true,
        },
        finalPrice: { type: Number, required: true }
}, {timestamps : true });

export default mongoose.model("ItemDiscount" , item_discountSchema);