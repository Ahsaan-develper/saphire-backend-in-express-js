import mongoose, { model } from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName : {type : String , required : true },
    lastName : {type : String , required : true },
    email : {type : String , required : true , unique: true },
    password : {type : String , required : true },
    refreshToken  : {type : String , required : true },
} ,{timestamps : true});

export default mongoose.model("Admin" , adminSchema);
