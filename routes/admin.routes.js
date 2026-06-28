import { Router } from "express";
import { deleteAdmin, loginAdmin, registerAdmin, updateAdmin } from "../controller/admin.controller.js";
import { Admin } from "mongodb";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";



const adminRouter = Router();


// register 

adminRouter.post("/" , registerAdmin);

// login

adminRouter.post("/login" , loginAdmin);

// update an admin

adminRouter.put("/:id"  , verifyAccessToken, updateAdmin);

// delete an admin

adminRouter.delete("/"  , verifyAccessToken, deleteAdmin);

export default adminRouter;