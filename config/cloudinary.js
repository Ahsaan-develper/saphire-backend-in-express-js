import {v2 as cloudinary} from "cloudinary";
import { _config } from "./envConfig.js";
import { BadRequestError , InternalServerError } from "../middleware/error.middleware.js";


cloudinary.config({ 
  cloud_name: _config.cloud_name, 
  api_key: _config.cloudinary_api_key, 
  api_secret: _config.cloudinary_secret_key
});

export const uploadToCloudinary = async (buffer , mimetype)=>{
        if(!buffer){
            throw new BadRequestError("File not given to cloudinary")
        }

        try{

            const response = await new Promise((resolve , reject)=>{
                    cloudinary.uploader.upload_stream(
                        {resource_type : "auto"},
                        (error , result )=> (error    ? reject (erorr) : resolve(result))
                        ).end(buffer);
            });
             return response.secure_url;
        }catch(err){
            throw new InternalServerError(err)
        }
}