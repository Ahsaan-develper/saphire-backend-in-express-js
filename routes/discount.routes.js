import { Router } from "express";
import { addDiscount, removeDiscount, updateDiscount } from "../controller/discount.controller.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";

const discountRouter = Router();

// make discount

discountRouter.post("/" , verifyAccessToken , addDiscount);

// update an discount 

discountRouter.put("/:id" , verifyAccessToken , updateDiscount);

// delete an discount 

discountRouter.delete("/:id" , removeDiscount);

export default discountRouter;