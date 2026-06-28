import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middleware/error.middleware.js";
import { generate_token_pair } from "../middleware/jwt.middleware.js";
import Admin from "../models/admin.models.js";
import bcrypt from "bcrypt";

// register admin 

export const registerAdmin = async(req , res)=>{
    const {firstName , lastName , email , password}  = req.body ;

    if (!firstName || !lastName || !email || !password){
        throw new BadRequestError("Please fill all fields");
    };

    const pattern = /@gmail\.com$/;
if (!email.length > 12 && pattern.test(email)) {
    throw new BadRequestError("Your email has issue check it ");
}
    try{
         const existingEmail = await Admin.findOne({ email });
        if(existingEmail){
            throw new ConflictError("Email already exist");
        }

        const hashedPassword = await bcrypt.hash(password , 10);


        const newAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            role : "admin",
            
        })
        const tokens = generate_token_pair(newAdmin._id, "admin");
        newAdmin.refreshToken = tokens.refreshToken;
    await newAdmin.save();
    res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
});
   
    // 8. Send response
    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        data: {
            _id: newAdmin._id,
            firstName: newAdmin.firstName,
            lastName: newAdmin.lastName,
            email: newAdmin.email,
            role: newAdmin.role,
            accessToken: tokens.accessToken,
            
        }
    });
    }catch(err){
        throw new InternalServerError(err);
    }


}


// login an admin

export const loginAdmin = async(req , res)=>{
    const {email , password} = req.body ;
    if(!email || !password){
        throw new BadRequestError("Please fill all fields");
    }
    const pattern = /@gmail\.com$/;
if (!email.length > 12 && pattern.test(email)) {
    throw new BadRequestError("Your email has issue check it ");
}

    try {
        const admin = await Admin.findOne({email});
        if(!admin){
            throw new NotFoundError("Email not found");
        }

        const isMatch = await bcrypt.compare(password , admin.password);

        if(!isMatch){
             throw new NotFoundError("password not match");
        }
        const token = generate_token_pair(admin._id , "admin");
        admin.refreshToken = token.refreshToken;
        res.cookie("refreshToken" , token.refreshToken , {
            httpOnly : true,
            secure : true,
            sameSite : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            messgae: "Admin is  login",
            _id : admin._id,
            accessToken : token.accessToken
        })
    }catch(err){
        throw new InternalServerError(err);
    }
}


// update admin 

export const updateAdmin = async(req , res)=>{
    const { firstName , lastName , email , password } = req.body;
    const { id } = req.params;
    if( !id ){
        throw new BadRequestError(" Id is not given for admin Update ");
    }

    try {

        const admin = await Admin.findById(id);
        if(!admin){
            throw new NotFoundError(" Admin not found for update ");
        }
        if(firstName){
            admin.firstName = firstName;
        }
        if(lastName) admin.lastName = lastName;
        if(email) admin.email = email;
        if(password){
          const hashedPassword =  await bcrypt.hash(password , 10);
            admin.password= hashedPassword;
        }

        await admin.save();

        res.status(200).json({
            message : "Admin is updated ",
            data : {
            _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role

            }
        })
        

    }catch(err){
        throw new InternalServerError(err);
    }
}


// delete an admin 
export const deleteAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new BadRequestError("Please provide email to delete account");
    }

    const deletedAdmin = await Admin.findOneAndDelete({ email });

    if (!deletedAdmin) {
        throw new NotFoundError("Admin with this email not found");
    }

    res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        data: {
            email: deletedAdmin.email
        }
    });
};