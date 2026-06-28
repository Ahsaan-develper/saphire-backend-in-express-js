
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import { generate_token_pair } from "../middleware/jwt.middleware.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";

// register an user 

export const registerUser = async (req , res)=>{
    const { firstName  , lastName , email , password } = req.body;
    if(!firstName || !lastName || !email || !password){
        throw new BadRequestError("Please fill all fields ")
    }

    try {

        const existingEmail = await User.findOne({email});

        if( existingEmail){
            throw new ConflictError(" Email already exist");
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = await User.create({
            firstName ,
            lastName,
            email ,
            password : hashedPassword,
        })

        const token = generate_token_pair(newUser._id , "user");

        newUser.refreshToken = token.refreshToken;
        await newUser.save();
        res.cookie("refreshToken" , token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000

        });

        res.status(201).json({
            message : "User is register",
            data : {
                _id  : newUser._id,
                email: newUser.email,
            },
            accessToken : token.accessToken
        })
    }catch(err){
        throw new InternalServerError(err);
    }
}

// login a user 

export const loginUser = async (req , res)=>{
    const { email , password} = req.body;
    
    if(!email || !password ){
        throw new BadRequestError("Please fill all fields ");
    }
    try {
        
   const user = await User.findOne({email});
   if(!user){
    throw new NotFoundError(" Email not found");
   }

   const isMatch = await bcrypt.compare(password , user.password);

    const tokens = generate_token_pair(user._id , "user");

    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly : true ,
         secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message : "User is login",
        accessToken : tokens.accessToken,
        _id : user._id
    })
    }catch(err){
        throw new InternalServerError(err);
    }
};


//  update an user 

export const updateUser = async (req ,res)=>{
    const { id } = req.params;
    if( !id ){
        throw new BadRequestError(" Id not given ");
    }
    const { firstName  , lastName , email , password } = req.body;
    
    try {

        const user = await User.findById( id );

        if(!user ){
            throw new NotFoundError("User not found");
        }

        if(firstName ) user.firstName = firstName;
        if(lastName ) user.lastName = lastName;
        if(email ) user.email = email;

        const hashedPassword = await bcrypt.hash(password , 10);
        if(password ) {
            user.password = hashedPassword;
        };

        res.status(200).json({
            message : "User is updated ",
            data : {
                _id : user._id,
                firstName : user.firstName,
                lastName : user.lastName ,
                email : user.email
            }
        })

    }catch (err){
        throw new InternalServerError(err);
    }
}


// delete an user 

export const deleteUser = async (req , res)=>{
    const {email } = req.body;
    if(!email){
        throw new BadRequestError(" Email not given ");
    }

    try {

        const user = await User.findOneAndDelete({email});
        if(!user){
            throw new NotFoundError(" User email is not found");
        }

        res.status(200).json({
            message : "User is deleted ",
            email : user.email,
            _id : user._id
        })

    }catch (err){
        throw new InternalServerError(err);
    }
}

