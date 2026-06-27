import { InternalServerError  , BadRequestError, NotFoundError} from "../middleware/error.middleware.js";
import Discount from "../models/discount.models.js";
import ItemDiscount from "../models/item_discount.models.js";
import Item from "../models/item.models.js";
// import itemModels from "../models/item.models.js";
// make an discount 
export const addDiscount = async(req, res )=>{
    const {name , startAt , endAt , discountValue  , type , fabricType , isActive } = req.body;

    if( !name || !startAt || !endAt || !discountValue || !type || !fabricType || !isActive){
        throw new BadRequestError("Please fill all fields");
    }

    if (discountValue < 0 ){
       throw new BadRequestError("Discount value cannon less then 0")
    }

    if(discountValue > 100){
        throw new BadRequestError(" Discount value not greater than 100");
    }

    try{

        const startDate = new Date(startAt);
        const endDate = new Date(endAt);

        if(isNaN(startDate.getTime()) && isNaN(endDate.getTime()) ){
            throw new BadRequestError("Invalid date format. Use ISO 8601 format");
        }
          const items = await Item.find({fabricType});

        if(!items || items.length ==0 ){
            throw new NotFoundError(" There is no item at discount on " , fabricType)
        }
        const discount = await Discount.create({
            name : name.trim(),
            startAt : startDate,
            endAt : endDate ,
            discountValue : Number(discountValue),
            type ,
            fabricType ,
            isActive : isActive !==undefined ? isActive : true 
        });

      

        let itemDiscounts = [];
        if(items.length >  0){
            itemDiscounts = items.map((item)=>{
                const originalPrice = Number(item.price);
                let finalPrice =0;
                if(type ==="percentage"){
                    finalPrice= originalPrice * (1 - discountValue / 100);
                }else{
                    finalPrice = Math.max(0 , originalPrice - discountValue);
                }
                finalPrice = Math.round(finalPrice * 100) / 100;
                return {
                    item : item._id ,
                    discount : discount._id,
                    finalPrice
                }
            });
            await ItemDiscount.insertMany(itemDiscounts);
              res.status(201).json({
        success: true,
        message: `Discount "${name}" created for ${fabricType}`,
        data: {
            discount,
            itemsAffected: items.length,
            itemPrices: itemDiscounts.map(id => ({
                itemId: id.item,
                finalPrice: id.finalPrice
            }))
        }
    });
        }
    }catch(err){
        throw new InternalServerError(err);
    }
}



// update discount on basis of fabric type 

export const updateDiscount = async (req , res)=>{
   
      const { name, startAt, endAt, discountValue, type, fabricType, isActive } = req.body;
    const { id } = req.params;
    if( !id )throw new BadRequestError(" Id is required for update ");

    try {

        const discount = await Discount.findById(id);

        if(!discount || discount.length <=0 ){
            throw new NotFoundError(" Item not found in discount");
        }

        if (name) discount.name = name.trim();
         if (startAt) {
        const startDate = new Date(startAt);
        if (isNaN(startDate.getTime())) {
            throw new BadRequestError("Invalid startAt date format");
        }
        discount.startAt = startDate;
    }
     if (endAt) {
        const endDate = new Date(endAt);
        if (isNaN(endDate.getTime())) {
            throw new BadRequestError("Invalid startAt date format");
        }
        discount.endAt = endDate;
    }

     if (discount.endAt <= discount.startAt) {
        throw new BadRequestError("endAt must be after startAt");
    }

     if (discountValue !== undefined) {
        if (discountValue < 0) {
            throw new BadRequestError("Discount value cannot be negative");
        }
        if (discount.type === "percentage" && discountValue > 100) {
            throw new BadRequestError("Percentage cannot exceed 100");
        }
        discount.discountValue = Number(discountValue);
    }

    if (type) {
        if (!["percentage", "fixed"].includes(type)) {
            throw new BadRequestError("Type must be percentage or fixed");
        }
        discount.type = type;
    }

      if (fabricType) {
        const validTypes = ["new arrival", "winter collection", "silk collection", 
            "velvet collection", "karandi collection", "khaddar collection", 
            "summer collection", "printed lawn collection"];
        if (!validTypes.includes(fabricType)) {
            throw new BadRequestError("Invalid fabricType");
        }
        discount.fabricType = fabricType;
    }

    if (isActive !== undefined) {
        discount.isActive = Boolean(isActive);
    }

     await discount.save();
     let itemDiscounts=[];
      if (discountValue !== undefined || type !== undefined) {
        const items = await Item.find({ fabricType: discount.fabricType });
        
        if (items.length > 0) {
            // Delete old item-discount records
            await ItemDiscount.deleteMany({ discount: id });

          
             itemDiscounts = items.map(item => {
                const originalPrice = Number(item.price);
                let finalPrice;

                if (discount.type === "percentage") {
                    finalPrice = originalPrice * (1 - discount.discountValue / 100);
                } else {
                    finalPrice = Math.max(0, originalPrice - discount.discountValue);
                }

                finalPrice = Math.round(finalPrice * 100) / 100;

                return {
                    item: item._id,
                    discount: discount._id,
                    finalPrice
                };
            });

            await ItemDiscount.insertMany(itemDiscounts);
        }
    }

    // 6. Response
    res.status(200).json({
        success: true,
        message: "Discount updated successfully",
        data: {
        discount,
        itemPrices: itemDiscounts
    }
    });

    }catch(err){
        throw new InternalServerError(err);
    }

}



// remove discount on basis of fabric type 

export const removeDiscount = async (req , res)=>{
    const { id } = req.params;

    if ( !id ){
        throw new BadRequestError("Id is required for delete an discount");
    }

    try {

        const discount = await Discount.findById(id);
        if(!discount){
            throw new BadRequestError(" Discount item is not found ");
        }

        await ItemDiscount.deleteMany({ discount : id });

        await Discount.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
        message: "Discount removed successfully",
        data: {
            removedDiscountId: id,
            fabricType: discount.fabricType
        }
        })

    }catch(err){
        throw new InternalServerError(err);
    }
}