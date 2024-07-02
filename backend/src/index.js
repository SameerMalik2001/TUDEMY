import dotenv from 'dotenv'
import connectDB from "./db/DB_Connect.js";
import { app } from './app.js';

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("⚙️  listening at", process.env.PORT)
    })
})
.catch(error=>{
    console.log("DB conn failed !!! due to ", error)
})