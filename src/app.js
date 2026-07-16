import express from "express"
import cors from "cors"

const app = express()

   //Basic Configurations
   app.use(express.json({limit:"16kb"}))
   app.use(express.urlencoded({extended:true, limit:"16kb"}))
   app.use(express.static("public"))

   
   //cors Configurations
   app.use(cors({
      origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5174",
      credentials:true,
      methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
      allowedHeaders:["Authorization","Content-Type"]
   }))
   
   app.get("/",(req,res) =>{
      res.send("Hello world")
   })
   
   app.get("/instagram",(req,res)=>{
      res.send("Insta is Dumpty now a days")
   })
   
   // Import the Routes
   import healthCheckRouter from "./routes/healthcheck.route.js"
   import authRouter from "./routes/auth.routes.js"

   app.use('/api/v1/healthcheck',healthCheckRouter)
   app.use('/api/v1/auth',authRouter)

   export default app