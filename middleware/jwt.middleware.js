import jwt from "jsonwebtoken";
import { _config } from "../config/envConfig.js";
import { BadRequestError } from "./error.middleware.js";
import User from "../models/user.models.js"
import Admin from "../models/admin.models.js"
export const generate_access_token = (userID , role="user")=>{
    const secret = role === "admin" ? _config.JWT_ADMIN_ACCESS_KEY : _config.JWT_USER_ACCESS_KEY
    return jwt.sign({sub : userID.toString() , role} , secret, {"expiresIn" :"7d"});
}


export const generate_refresh_token = (userID , role="user")=>{
    const secret = role ==="admin" ? _config.JWT_ADMIN_REFRESH_KEY : _config.JWT_USER_REFRESH_KEY
    return jwt.sign({sub : userID.toString() , role} , secret , {"expiresIn" :"7d"});
}

export const generate_token_pair = (userID, role = "user") => ({
    accessToken: generate_access_token(userID, role),
    refreshToken: generate_refresh_token(userID, role)
});

export const verify_token = (token) =>{
    const decoded = jwt.decode(token);
    if(!decoded?.role){
        throw new BadRequestError("Invalid token payload")
    };

    const secret = decoded.role === "admin" ? _config.JWT_ADMIN_ACCESS_KEY : _config.JWT_USER_ACCESS_KEY;
    return jwt.verify(token , secret);
}


export const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        
        // Your existing function works here
        const payload = verify_token(token);
        
        req.userId = payload.sub;
        req.role = payload.role;
        next();
        
    } catch (err) {
        return res.status(401).json({ message: err.message || "Invalid token" });
    }
};

export const verify_refresh_token = (token) => {
    const decoded = jwt.decode(token);
    if (!decoded?.role) throw new Error("Invalid token payload");

    const secret = decoded.role === "admin"
        ? _config.JWT_ADMIN_REFRESH_KEY
        : _config.JWT_USER_REFRESH_KEY;

    return jwt.verify(token, secret);
};


export const rotate_token = async (incomingRefreshToken)=>{
    const decode = jwt.decode(incomingRefreshToken);

    if(!decode.role){
        throw new BadRequestError("Invalid token format")
    };

    const payload = verify_refresh_token (incomingRefreshToken);

    const model = payload.role==="Admin" ? Admin : User;
      const account = await Model.findById(payload.sub);
    if (!account) {
        throw new Error("Account not found");
    }

    if (account.refreshToken !== incomingRefreshToken) {
        account.refreshToken = null;
        await account.save();
        
        throw new Error("Token reuse detected. Please login again.");
    }

    // 6. Generate new pair
    const newTokens = generate_token_pair(payload.sub, payload.role);

    // 7. Update stored token (overwrite old one)
    account.refreshToken = newTokens.refreshToken;
    await account.save();

    return newTokens;

};
