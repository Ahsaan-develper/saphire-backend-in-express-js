import express from "express";
import { connectDB } from "./config/db.js";
import { InternalServerError } from "./middleware/error.middleware.js";
import { _config } from "./config/envConfig.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import discountRouter from "./routes/discount.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { shipmentRouter } from "./routes/shipment.routes.js";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(async ( req , res , next)=>{
    await connectDB();
    next();
})

//admin
app.use("/admin",adminRouter);

//user
app.use("/user", userRouter);

//item 
app.use("/item" , itemRouter);

//discount
app.use("/discount", discountRouter);

//cart 
app.use("/cart" , cartRouter);

//order
app.use("/order", orderRouter);

//payment
app.use("/payment" , paymentRouter)

// shipment 
app.use("/shipment" , shipmentRouter);



if(_config.NODE_ENV !="production"){
    const startServer = async()=>{
    await connectDB();

    try {

        app.listen(_config.port , ()=>{
            console.log("Server is running on port" , _config.port);
        })
    }catch(err){
        process.exit(1);
        throw new InternalServerError(err);
    }
}

startServer();
}

export default app;
