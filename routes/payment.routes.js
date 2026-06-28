import { Router } from "express";
import { getSpecificOrderPayment, makePayment } from "../controller/payment.controller.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";

export const paymentRouter = Router();

// make an payment 

paymentRouter.post("/" , verifyAccessToken , makePayment);

// get a specific order payment 

paymentRouter.get("/:orderId" , verifyAccessToken , getSpecificOrderPayment);