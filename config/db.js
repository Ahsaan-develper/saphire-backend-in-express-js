import mongoose from "mongoose";
import { _config } from "./envConfig.js";
import { InternalServerError } from "../middleware/error.middleware.js";

let isConnected = false;


export const connectDB = async( )=>{
    if (isConnected) return;    

      if (mongoose.connection.readyState === 1 || 
        mongoose.connection.readyState === 2) return;

    mongoose.connection.on("connected" , ()=>{
        console.log("Db is connected !!!");
    })

    mongoose.connection.on("disconnected" , ()=>{
        console.log("Db is disconnected !!!");
    })

    mongoose.connection.on("close" , ()=>{
        console.log("DB is close !!!");
    })


        try {
        await  mongoose.connect(_config.mongo_string)
        isConnected = true;
        }catch(err){
            isConnected = false;
            throw new InternalServerError(err);
            process.exit(1);
        }
    
}