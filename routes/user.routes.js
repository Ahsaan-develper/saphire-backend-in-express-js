import { Router } from "express";
import { deleteUser, loginUser, registerUser, updateUser } from "../controller/user.controller.js";

const userRouter = Router();

// register new user 

userRouter.post("/"  , registerUser);

// login user

userRouter.get("/"  , loginUser);

// update user 

userRouter.put("/:id" , updateUser);

// delete an user 

userRouter.delete("/" , deleteUser);

export default userRouter;