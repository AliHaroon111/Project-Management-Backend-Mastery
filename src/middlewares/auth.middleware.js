import { header } from "express-validator";
import { User } from "../models/user.models.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //encoded
    // these header i crt on postman 
    //cookies?.accessToken ------> optionally if access the token
    // We are replaceing { "Bearer " } bcz we only need Token not bearer

    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }

    // if token avail -> then decode it
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

        if(!token){
            throw new ApiError(401,"Your token is Not Valid")
        }

        req.user = user
        next() // inject infor. to req
    } catch (error) {
        throw new ApiError(401,"Invalid Access Token")
    }
});