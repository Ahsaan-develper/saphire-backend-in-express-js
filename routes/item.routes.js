import { Router } from "express";
import { addItem, deleteItem, getItemByFabric, updateItem } from "../controller/item.controller.js";

import { uploadToMulter } from "../middleware/multer.middleware.js";
import { verifyAccessToken } from "../middleware/jwt.middleware.js";

const itemRouter = Router();


// add item 

itemRouter.post("/"  , verifyAccessToken, uploadToMulter.array("images" , 4) , addItem);

// get itemss by fabric 

itemRouter.get("/" , verifyAccessToken , getItemByFabric);

// update an item 

itemRouter.put("/:id" , verifyAccessToken , uploadToMulter.array("images" , 4) , updateItem);

// delete an id 
itemRouter.delete("/:id"  , verifyAccessToken, deleteItem);
export default itemRouter;