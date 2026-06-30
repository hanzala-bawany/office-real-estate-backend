import express from 'express';
import { authRoutes } from './src/routes/authRoutes.js';
import helmet from 'helmet';
import cors from 'cors';
import { xssMidleware } from './src/utills/xssMiddleware.js';
import { connectDB } from './src/utills/connectDB.js';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import { Routes } from './src/routes/index.js';

dotenv.config()
connectDB()

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin :  ["http://localhost:5173" , "http://localhost:5174"] ,
  credentials : true
 }));
app.use(helmet());
app.use(xssMidleware);


// app.use('/api/auth', authRoutes)              // yun bhi kar sakte the but  is file me bohot kuch routes ho sakte he to unko alag file me rakhna acha he is liye index.js me import kar ke use kar rahe he 
app.use('/api', Routes)                          // best practice ye he ke routes ko alag file me rakh ke import karen or use karen
app.get("/", (req, res) => {
  res.status(200).send("Server is Running");
});

if (process.env.NODE_ENV === "development") {   //  serverless platforms pe deploye karen ge to listen nahi kar wana he
  app.listen(port,"0.0.0.0" , () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export default app;
