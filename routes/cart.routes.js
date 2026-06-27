import { Router } from "express";
import { addToCart, removeCartItems, updateCart } from "../controller/cart.controller.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";


export const cartRouter = Router();


// add item into cart 

cartRouter.post("/" , verifyAccessToken , addToCart);

// update cart quantity of an item 

cartRouter.put("/" , verifyAccessToken , updateCart);

// delete an cart item 

cartRouter.delete("/:cartItemId" , removeCartItems);