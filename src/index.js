import { configDotenv } from 'dotenv'
import app from './app.js'
import connectDB from './db/index.js'

configDotenv("./")

console.log(process.env.Check)

connectDB()
  .then( ()=>{
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000')
      console.log("HI Dear Check Express workings");
    })
  })
  .catch((error)=>{
    console.error("MongoDB Connection error",error)
    process.exit(1)
  })



