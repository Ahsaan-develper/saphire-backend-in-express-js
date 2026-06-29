import ShipmentModel from "../models/shipment.models.js";
import UserModel from "../models/user.models.js";
import OrderModel from "../models/order.models.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";


// make a shipment 

export const makeShipment = async ( req , res )=>{
    const { country ,  firstName , lastName , address , appartment, city , postalCode , phone , user , order } = req.body ;
    if ( !country || !firstName || !lastName || !address || !appartment || !postalCode || !phone || !user || !order) throw new BadRequestError(" Please fill all fields  ");

    try {

        const checkOrder = await OrderModel.findById( order );

        if( !checkOrder ) throw new NotFoundError(" Order is not place ");

        const checkUser = await UserModel.findById( user );

        if( !checkUser ) throw new NotFoundError(" user is not found ");

        const shipment = await ShipmentModel.create({
            country ,
            firstName , 
            lastName , 
            address , 
            appartment, 
            city , 
            postalCode , 
            phone , 
            user , 
            order
        })

        res.status(201).json ({
            message : " Shipment is placed ",
            data : {
                shipment
            }
        })
    }catch (err ){
        throw new InternalServerError ( err );
    }
}



// get a specific shipment 

export const getSpecificShipment = async ( req , res ) =>{
    const { shipmentId } = req.params ;
    if ( !shipmentId ) throw new BadRequestError(" shipment id is required to get shipment ");

    try {

        const checkShipment = await ShipmentModel.findById(shipmentId );

        if ( !checkShipment ) throw new NotFoundError (" Shipment not made ");

        res.status(200).json({
            checkShipment
        })

    }catch ( err ){
        throw new InternalServerError( err );
    }
}   
