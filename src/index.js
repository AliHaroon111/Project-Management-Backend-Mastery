import dotenv from 'dotenv';
import app from './app.js'
import connectDB from './db/index.js'

dotenv.config({ path: './.env' })

const port = process.env.PORT

connectDB()
  .then( ()=>{
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
      console.log("HI Dear Check Express workings");
    })
  })
  .catch((error)=>{
    console.error("MongoDB Connection error",error)
    process.exit(1)
  })



