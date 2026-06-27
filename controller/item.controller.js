import { uploadToCloudinary } from "../config/cloudinary.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import Item from "../models/item.models.js";
import Images  from  "../models/image.models.js";
import {v2 as Cloudinary} from "cloudinary";
//  add an item 

export const addItem = async (req , res)=>{
    const { title , price, description , fabricType , product_type} = req.body ;
    if( !title || !price || !description || !fabricType || !product_type) throw new BadRequestError("PLease fill all fields");
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("At least one image is required");
    }
        if (req.files.length !== 4) {
        throw new BadRequestError("Exactly 4 images required: front, back, middle, side");
    }

    try{

        const newItem = await Item.create({
            title : title.trim(),
            price,
        description: description.trim(),
        fabricType,
        product_type
        });

        const uploadedURI = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.buffer))
        );
        const autoRoles = ["front", "back", "middle", "side"];
         const imageDocs = uploadedURI.map((result, index) => ({
            uri: result.url,          
            publicId: result.publicId, 
            role: autoRoles[index],
            item: newItem._id
        }));

        await Images.insertMany(imageDocs);

        res.status(201).json({
            success: true,
            message: "Item added successfully",
            data: {
                item: newItem,
                images: imageDocs
            }
        });
    }catch(err){
        throw new InternalServerError(err);
    }
}


// get items by fabric type 

export const getItemByFabric = async (req , res)=>{
    const {fabricType } = req.body ;

    if( !fabricType) throw new BadRequestError(" Fabric type is missing");

    try {

        const items = await Item.aggregate([
            { $match : {fabricType}},
            {
                $lookup : {
                    from : "images",
                    localField : "_id",
                    foreignField : "item",
                    as : "images"
                }
            }
        ])
        if(!items || items.length === 0) throw new NotFoundError(" Type is not found");

         res.status(200).json({
        success: true,
        count: items.length,
        data: items
    });

    }catch(err){
        throw new InternalServerError(err);
    }
}

// update an item 

export const updateItem = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Id is required for update");

    const { title, price, description, fabricType, product_type } = req.body;
    if (!title || !price || !description || !fabricType || !product_type) {
        throw new BadRequestError("Please fill all fields");
    }

    if (!req.files || req.files.length === 0) {
        throw new BadRequestError("At least one image is required");
    }
    
    if (req.files.length !== 4) {
        throw new BadRequestError("Exactly 4 images required: front, back, middle, side");
    }

    // 1. Update item directly (no save() ambiguity)
    const item = await Item.findByIdAndUpdate(
        id,
        {
            title: title.trim(),
            price,
            description: description.trim(),
            fabricType,
            product_type
        },
        { new: true, runValidators: true }
    );

    if (!item) throw new NotFoundError("Item not found");

    // 2. Delete old images from Cloudinary + MongoDB
    const oldImages = await Images.find({ item: id });
    
    if (oldImages.length > 0) {
        await Promise.all(
            oldImages.map(img => {
                if (img.publicId) {
                    return Cloudinary.uploader.destroy(img.publicId); // lowercase
                }
                return Promise.resolve();
            })
        );
        await Images.deleteMany({ item: id });
    }

    // 3. Upload new images
    const uploadResults = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
    );

    const autoRoles = ["front", "back", "middle", "side"];
    const imageDocs = uploadResults.map((result, index) => ({
        uri: result.url,
        publicId: result.publicId,
        role: autoRoles[index],
        item: item._id
    }));

    await Images.insertMany(imageDocs);

    // 4. Response
    res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: {
            item,
            images: imageDocs
        }
    });
};



// delete an item
export const deleteItem = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Id is required for delete");

    // 1. Check if item exists
    const item = await Item.findById(id);
    if (!item) throw new NotFoundError("Item not found");

    // 2. Find and delete images from Cloudinary
    const oldImages = await Images.find({ item: id });
    
    if (oldImages.length > 0) {
        await Promise.all(
            oldImages.map(img => {
                if (img.publicId) {
                    return Cloudinary.uploader.destroy(img.publicId); 
                }
                return Promise.resolve();
            })
        );
        
        await Images.deleteMany({ item: id });
    }

    
    await Item.findByIdAndDelete(id);

    // 5. Response
    res.status(200).json({
        success: true,
        message: "Item and associated images deleted successfully"
    });
};