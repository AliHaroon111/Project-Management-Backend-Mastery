import {User} from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";


const generateAccessAndRefressToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
    //comment this(above line) and see below why we crt this

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken // now this refreshToken that we generated now is Going in the database -----> Not save yet (but field is populated)
    
    // now to save 
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token"
        )
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password,role} = req.body

    const existingUser = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    });

    if(existingUser){
        throw new ApiError(409,"User with email or username already exists",[])
    }

    const user = User.create({ //here User-->not able to access schema methods because it's the mongoose model but {user} can why? bcz User is a mongoose method we already imported from model itsel
        username,
        email,
        password,
        isEmailVerified: false
    })
    // because our use have User(schema) So it have all the method available in the userSchema
    const {unHashedToken, hashedToken , tokenExpiry} = user.generateTemporaryToken()

    // Now save the tokens into the fields in schema
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave : false})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        MailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
        )
    });

     //Responce back to the request
     const createdUser =await User.findById(user._id).select( // select says i don't want that field
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    res
    .status(201)
    .json(
        new ApiResponse(
            200,
            {user: createdUser},
            "User registered seccessfully and verification email has been sent on your email"
        )
    )
})

export {registerUser}