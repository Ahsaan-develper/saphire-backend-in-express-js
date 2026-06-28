import { Router } from "express";
import { getSpecificShipment, makeShipment } from "../controller/shipment.controller.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";

export const shipmentRouter = Router();

// make a shipment 

shipmentRouter.post("/" , verifyAccessToken , makeShipment);

// get single shipment 

shipmentRouter.get("/:orderId" ,  verifyAccessToken , getSpecificShipment);