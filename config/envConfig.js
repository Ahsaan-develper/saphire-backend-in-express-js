import dotenv from "dotenv";

dotenv.config();

 export const _config = {
    mongo_string : process.env.MONGO_STRING,
    port : process.env.PORT,
    cloudinary_secret_key : process.env.CLOUD_API_SECRET_KEY,
    cloudinary_api_key : process.env.CLOUD_API_KEY,
    cloudinary_name : process.env.CLOUD_NAME,
    JWT_USER_ACCESS_KEY : process.env.JWT_USER_ACCESS_KEY,
    JWT_USER_REFRESH_KEY : process.env.JWT_USER_REFRESH_KEY,
    JWT_ADMIN_ACCESS_KEY : process.env.JWT_ADMIN_ACCESS_KEY,
    JWT_ADMIN_REFRESH_KEY : process.env.JWT_ADMIN_REFRESH_KEY,
    NODE_ENV : process.env.NODE_ENV
}