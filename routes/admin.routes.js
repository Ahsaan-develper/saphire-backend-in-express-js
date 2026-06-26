import { Router } from "express";
import { deleteAdmin, loginAdmin, registerAdmin, updateAdmin } from "../controller/admin.controller.js";
import { Admin } from "mongodb";



const adminRouter = Router();


// register 

adminRouter.post("/" , registerAdmin);

// login

adminRouter.get("/" , loginAdmin);

// update an admin

adminRouter.put("/:id" , updateAdmin);

// delete an admin

adminRouter.delete("/" , deleteAdmin);

export default adminRouter;