import { BadRequestError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import OrderModel from "../models/order.models.js";
import OrderItemsModel from "../models/orderItems.models.js";
import ItemModel from "../models/item.models.js";
import UserModel from "../models/user.models.js";
import orderModels from "../models/order.models.js";
import CartModel from "../models/cart.models.js";
import cartItemsModels from "../models/cartItems.models.js";
import orderItemsModels from "../models/orderItems.models.js";



export const addOrder = async ( req , res ) => {
    const { user } = req.body ;

    if( !user) throw new BadRequestError(" User ID is required to place an order ");


    try {

        const checkUser = await UserModel.findById( user );

        if( !checkUser ) throw new NotFoundError(" User is not found ");
        
        const cart = await CartModel.findOne({user});

        if( !cart ) throw new NotFoundError(" Cart not found ");

        const cartItems = await cartItemsModels.find({ cart : cart._id }).populate("item");

        if( cartItems.length === 0 ) throw new NotFoundError (" No item found in cart ");


        let  totalPrice  =0 ;
        const orderItemsData = cartItems.map( cartItem =>{
            const itemPrice = Number(cartItem.item.price);
            const quantity = cartItem.quantity;
            totalPrice += itemPrice * quantity;

            return {
                item  : cartItem.item._id ,
                quantity : quantity ,
                priceAtPurchase : itemPrice
            }
        });

              // 5. Create Order
    const order = await OrderModel.create({
        orderStatus: "pending",
        totalPrice: Math.round(totalPrice * 100) / 100,
        user
    });

    const orderItemsIds = orderItemsData.map(data =>({
        ...data ,
        order : order._id 
    }));

     await orderItemsModels.insertMany(orderItemsIds);
     await cartItemsModels.deleteMany({ cart: cart._id });
      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: {
            orderId: order._id,
            totalPrice: order.totalPrice,
            itemCount: cartItems.length,
            items: orderItemsData.map(d => ({
                itemId: d.item,
                quantity: d.quantity,
                price: d.priceAtPurchase
            }))
        }
    });

    }catch ( err ){
        throw new InternalServerError( err );
    }
}


// update an order 

// update  an order status 

export const updateOrder = async ( req , res ) =>{
    const { orderStatus } = req.body ;
    const { orderId } = req.params;
    if( !orderId ) throw new BadRequestError(" Id is required for update status ");
    if( !orderStatus ) throw new BadRequestError(" Order status is not given ");

    try {
       

        if(!["pending" , "completed" , "cancel"].includes(orderStatus)) throw new BadRequestError(" Order status must have pending , cancel , completed not other data");
        const order = await OrderModel.findById(orderId );
        if( !order ) throw new NotFoundError(' Order not found ');

        order.orderStatus= orderStatus ;
        await order.save();

        res.status(200).json({
            message : "Order is updated ", 
            data : {
                order : order 
            }
        })
    }catch ( err ){
        throw new InternalServerError ( err );
    }
}