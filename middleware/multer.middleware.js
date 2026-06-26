import multer from "multer"
const storage = multer.memoryStorage()


 export const uploadToMulter = multer({ storage: storage  , limits : 30 * 1024 * 1024 });