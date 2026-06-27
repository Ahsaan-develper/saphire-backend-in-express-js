import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import Cart from "../models/cart.models.js";
import CartItem from "../models/cartItems.models.js";
import Item from "../models/item.models.js";

// add to cart 

export const addToCart = async (req , res)=>{
    const { user , guestId , quantity  , item  } = req.body ;
    if( !quantity || !item )throw new BadRequestError("Please fill all fields");
     if (!user && !guestId) {
        throw new BadRequestError("Either user or guestId is required");
    }

    try {

        let itemData  =await Item.findById(item);

        if(!itemData) throw new NotFoundError(" Item not exist ");



        let cart ;
        if(user){
            cart = await Cart.findOne({user});
        }else{
            cart = await Cart.findOne({ guestId });
        }

        if( !cart ){
            cart = await Cart.create({
                user : user || null,
                guestId  : user? null : guestId 
            })
        }

        let isItemExist = await CartItem.findOne({item});

        if(isItemExist){
            throw new ConflictError("Item already in cart");
        }

        const cartItems =await CartItem.create({
            quantity : Number(quantity) ,
            cart  : cart._id,
            item
        });

        res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: {
            cartId: cart._id,
            item: itemData.title,
            quantity: cartItems.quantity
        }
        })

    }catch (err){
        throw  new InternalServerError(err);
    }
}



// update cart item quantity 

export const updateCart = async (req , res)=>{
    const { quantity  , item} = req.body ;
    if( !quantity  || !item)throw new BadRequestError("Please fill all fields");

    try {


        const cartItems = await CartItem.findOne({item});

        if( !cartItems)throw new NotFoundError("Item is not found");

        cartItems.quantity = Number(quantity)
        await cartItems.save();
        res.status(200).json({
        success: true,
        message: "Quantity updated",
        data: cartItems
    });
    }catch (err){
        throw new InternalServerError(err);
    }
}



// remove items from cart 

export const removeCartItems = async(req ,res)=>{
    const { cartItemId } = req.params;

    if( !cartItemId )throw new BadRequestError(" Id is require for remove item ");

    try {

        const cartItems = await CartItem.findById( cartItemId );
        if( !cartItemId ) throw new NotFoundError( "Item is not found in cart ");


        await CartItem.findByIdAndDelete( cartItemId );

        res.status(200).json({
            message : " Cart Item is deleted ",
        })
    }catch(err){
        throw new InternalServerError(err);
    }
}