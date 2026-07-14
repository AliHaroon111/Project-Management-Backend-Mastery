import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        avatar: {
            type: {
                url:String,
                localPath: String,
            },
            default:{
                url:'https://placehold.co/200x200',
                localPath:""
            }
        },
        username:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName: {
            type: String,
            trim:true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        isEmailVerified: {
            type : Boolean,
            default: false
        },
        refreshToken:{
            type: String
        },
        forgotPasswordToken: {
            type: String
        },
        forgotPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        },      
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function(next){
    //if we dont have this condition then this pre hook will run for every save
    if(!this.isModified("password")) return next()  // mean if the modified thing is not password 
    const password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// -------------->With Data Token<---------------------------
// Access Token(jwt) creation
userSchema.methods.generateAccessToken = function(){            // Never convert this to an arrow function (() => {}).
    return jwt.sign(  //jwt.sign(payload, secret, options)
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// Refresh Token(jwt) creation
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)

}
// -------------->With Data Token <---------------------------

export const User = mongoose.model("User",userSchema)