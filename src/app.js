import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()
app.use(cookieParser())

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
   
   
   // Import the Routes
   import healthCheckRouter from "./routes/healthcheck.route.js"
   import authRouter from "./routes/auth.routes.js"
   import projectRouter from "./routes/project.routes.js"

   // Routes
   app.use('/api/v1/healthcheck',healthCheckRouter)
   app.use('/api/v1/auth',authRouter)
   app.use('api/v1/projects', projectRouter)
   

   app.get("/",(req,res) =>{
      res.send("Hello world")
   })
   export default app