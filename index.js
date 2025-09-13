import express from 'express';
import { authRoutes } from './src/routes/authRoutes.js';
import helmet from 'helmet';
import cors from 'cors';
import { xssMidleware } from './src/utills/xssMiddleware.js';
import { connectDB } from './src/utills/connectDB.js';
import cookieParser from 'cookie-parser';

connectDB()

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin :  ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"] ,
  // credentials : true
 }));
app.use(helmet());
app.use(xssMidleware);


app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV === "development") {   //  serverless platforms pe deploye karen ge to listen nahi kar wana he
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export default app;
