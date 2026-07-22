import crypto from "crypto"
import jwt from "jsonwebtoken"
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

    const user = await User.create({ //here User-->not able to access schema methods because it's the mongoose model but {user} can why? bcz User is a mongoose method we already imported from model itsel
        username,
        email,
        password,
        isEmailVerified: false
    })
    // because our use have User(schema) So it have all the method available in the userSchema
    const {unHashedToken, hashedToken , tokenExpiry} = user.generateTemporaryToken()

    // Now save the tokens into the fields in schema
    user.emailVerificationToken = hashedToken   //hashed token saved in DB and unHashed send with email URL
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
     const createdUser = await User.findById(user._id).select( // select says i don't want that field
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

const login = asyncHandler( async(req, res) =>{
    const {username, email, password} = req.body

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400,"User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid Credentials")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefressToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfuly"
            )
        )
})

const logoutUser = asyncHandler( async(req, res) =>{
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        },
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(200, {}, "User logget out")
        )
})

const getCurrentUser = asyncHandler( async(req, res) =>{
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
})

const verifyEmail = asyncHandler( async(req, res) =>{
    const verificationToken = req.params // this 'verificationToken' comes from the routes

    if(!verificationToken){
        throw new ApiError(400, "Email verification token is missing go ahead and check")
    }

    let hashedToken = crypto //hash the unHashedToken again that we get from url ---> this will give you the same hashedToken that is stored in you DB
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

    const user = await User.findOne({
        emailVerificationToken: hashedToken, // the token we just hashed above now
        emailVerificationExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(400, "Token is invalid or expired")
    }

    user.emailVerificationToken = undefined; // dont want unneccasary data
    user.emailVerificationExpiry = undefined;

    user.isEmailVerified = true
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true,
                },
                "Email is Verified",
            ),
        )
});

const resendEmailVerificaction = asyncHandler( async(req, res) =>{
    // resendEmailverification will only send by the user who is already loggedIn
    const user = await User.findById(req.user._id); // by verifyJWT
    if(!user){
        throw new ApiError(404, "User does not exits")
    }
    
    if(user.isEmailVerified){
        throw new ApiError(409, "Email is already verified")
    }
    // now if the email is not verified
    const {unHashedToken, hashedToken , tokenExpiry} = user.generateTemporaryToken()

    // Now save the tokens into the fields in schema - repeat the process
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
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to your email ID"
            )
        )
})

const refreshAccessToken = asyncHandler( async(req, res) =>{
    //when the accesstoken is expired (YOU CAN REFRESH THE TOKEN)
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized access")
    }

    // if i have token need to decode
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"refresh Token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // generate the accesssToken based on Id
        const {accessToken, refreshToken: newRefreshToken} = await user.generateAccessAndRefressToken(user._id);

        user.refreshToken = newRefreshToken
        await user.save()

        return res
            .status(200)
            .cookie("accessToken",accessToken , options)
            .cookie("refreshToken",refreshToken , options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token")
    }
})

export { 
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerificaction,
    refreshAccessToken
    }