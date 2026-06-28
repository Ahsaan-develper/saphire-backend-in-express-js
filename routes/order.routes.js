import { Router} from "express";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";
import { addOrder, updateOrder } from "../controller/order.controller.js";

export const orderRouter = Router();


// order item 

orderRouter.post("/" , verifyAccessToken , addOrder);

// update an status 

orderRouter.put("/:orderId" , updateOrder );