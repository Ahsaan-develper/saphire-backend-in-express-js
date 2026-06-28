import mongoose from "mongoose";

const shipmentSchema  = new mongoose.Schema ({
     country : {type : String , required : true},
     firstName : {type : String , required : true},
     lastName : {type : String , required : true},
     address : {type : String , required : true},
     appartment : {type : String , required : true},
     city : {type : String , required : true},
     postalCode : {type : String , required : true},
     phone : {type : String , required : true},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
     order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
        required : true,
    },
    } , {timestamps : true});

    export default mongoose.model("Shipment" ,shipmentSchema);