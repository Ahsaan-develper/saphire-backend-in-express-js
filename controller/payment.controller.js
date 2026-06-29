import { BadRequestError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import OrderModel from "../models/order.models.js";
import paymentModels from "../models/payment.models.js";
import PaymentModel from "../models/payment.models.js";


// make payment 
export const makePayment = async ( req , res )=>{
    const { method , billingAddressType  , order } = req.body ;
    if( !method || !billingAddressType  || !order ) throw new BadRequestError(" Please fill all fields");

    try {

        const checkOrder = await OrderModel.findById(order);
        if( !checkOrder ) throw new NotFoundError(" Order is placed ");
        let billingAddress ;
        if (billingAddressType == "same"){
            billingAddress= "same";
        }else {
            billingAddress = billingAddressType;
        }

        if(!['bank' , "cashondelivery"].includes(method)) throw new  BadRequestError( " Please select  bank or cashondelivery");


        const payment = await paymentModels.create({
            method ,
            billingAddressType, 
            billingAddress ,
            order
        });

        res.status(201).json({
            message : " Payment is set ", 
            data : {
                payment : payment
            }
        })
    }catch( err ){
        throw new InternalServerError( err );
    }
}

// check payment for specific order 

export const getSpecificOrderPayment = async ( req , res )=>{
    const { orderId } = req.params ;
    if( !orderId ) throw new BadRequestError(" Order Id is required to check payment ");

    try {

    
    
        
        const orderPayment  =  await PaymentModel.findOne({ order :orderId });
        if( !orderPayment ) throw new NotFoundError(" Payment not given ");
      
        res.status(200).json({
            data: {
                orderPayment : orderPayment
            }
        })

    }catch ( err ){
        throw new InternalServerError ( err );
    }
}

