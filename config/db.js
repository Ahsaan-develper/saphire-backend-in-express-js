import mongoose from "mongoose";
import { _config } from "./envConfig.js";
import { InternalServerError } from "../middleware/error.middleware.js";



export const connectDB = async( )=>{
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
            
        }catch(err){
            throw new InternalServerError(err);
            process.exit(1);
        }
    
}