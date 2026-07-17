import mongoose from "mongoose";
import {configDotenv} from "dotenv";

configDotenv("../../.env" );


const connectDB = async () =>{
    try {
        //Remember Always to use Await   ------------> For interview Itself🤪

        await mongoose.connect(process.env.DATABASE_URL)
        console.log("MongoDB Connected Successfully😃")
    } catch (error) {
        console.error("Bad Things may happens - MongoDB Connection error",error)
        process.exit(1)
    }
}
// console.log(process.env.DATABASE_URL

export default connectDB