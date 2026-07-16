import {User} from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";


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
})

