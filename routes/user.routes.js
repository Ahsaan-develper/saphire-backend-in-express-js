import { Router } from "express";
import { deleteUser, loginUser, registerUser, updateUser } from "../controller/user.controller.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";

const userRouter = Router();

// register new user 

userRouter.post("/"  , registerUser);

// login user

userRouter.post("/login"  , loginUser);

// update user 

userRouter.put("/:id",  verifyAccessToken , updateUser);

// delete an user 

userRouter.delete("/"  , verifyAccessToken, deleteUser);

export default userRouter;