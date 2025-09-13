import express from "express";
import { loginController, signupController , logoutController , userVerification , verificationCodeDeleted , resendCode } from "../controllers/authControllers.js";
import { rateLimiter } from "../utills/rateLimiter.js";


const authRoutes = express.Router()

authRoutes.post('/signup' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , signupController);

authRoutes.post('/login' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , loginController);

authRoutes.post('/logout' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , logoutController);

authRoutes.post('/verifyUser' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , userVerification);

authRoutes.patch('/verificationCodeDelete' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , verificationCodeDeleted);

authRoutes.post('/resendCode' , rateLimiter(60 * 1000 , 2 , "Too Much Req") , resendCode);


export {authRoutes}


