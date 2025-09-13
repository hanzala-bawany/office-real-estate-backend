import { errorHandler, successHandler } from "../utills/responseHandler.js"
import pkg from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { Users } from "../models/authModel.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../verifyEmail/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config();

const { sign } = pkg;
const { hash, compare } = bcrypt


export const signupController = async (req, res) => {

    console.log("signup chala")
    console.log(req.body, "req.body");

    try {

        const { userName, email, password, avatar } = req.body

        if (!userName || !email || !password) {
            return errorHandler(res, 400, "Missing Fields");
        }
        if (!email.includes("@")) {
            return errorHandler(res, 400, "Invalid Email");
        }
        if (password.length < 6 || password.length > 12) {
            return errorHandler(res, 400, "password must greater then 6 and smaller then 12");
        }

        const isExist = await Users.findOne({ email: email });   // ye kaam schema se bhi kar dia he ye bas ees hi for pract
        if (isExist) return errorHandler(res, 402, "User already exist");

        const hashedPassword = await hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        sendVerificationEmail(email, verificationCode.toString())

        const createdUser = await Users.create({
            userName,
            email,
            password: hashedPassword,
            avatar,
            verificationCode
        })

        successHandler(res, 200, "User Registered Successfully")

    }
    catch (error) {

        if (error.code === 11000) {
            return errorHandler(res, 409, "User already exists");
        }
        errorHandler(res, 500, "Something went wrong, please try again later", error);
    }

}


// login controller
export const loginController = async (req, res) => {
    console.log("login chala");

    try {
        const { email, password } = req.body;

        if (!email || !password) return errorHandler(res, 400, "Miising Fields !");

        if (!email.includes("@"))
            return errorHandler(res, 400, "Email is not valid");

        if (password.length < 6 || password.length > 12)
            return errorHandler(
                res,
                401,
                "Password must greater then 6 and less then 12"
            );

        const isExist = await Users.findOne({ email: email });
        if (!isExist) return errorHandler(res, 404, "User not found");
        // if (!isExist.isVerified) return errorHandler(res, 401, "Unauthorized User");


        const comparePass = await compare(password, isExist?.password);
        if (!comparePass) return errorHandler(res, 404, "invalid password");

        const token = sign(
            {
                userId: isExist._id,
                userEmail: email,
                isAdmin: isExist.isAdmin,
            },
            process.env.JWT_secretKey,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax", 
            secure: process.env.NODE_ENV === "development" ? false : true,
        }).status(200).json("User login successfully");

        console.log("login in  successfully", isExist);
        sendWelcomeEmail(isExist.email, isExist.userName)

    } catch (err) {
        console.log(err, "loginUser me error he");
        errorHandler(res, 402, "user cant login", err);
    }

};


export const logoutController = (req, res) => {

    res.clearCookie("token" ,  {
        httpOnly: true,
        sameSite: "Lax", 
        secure: process.env.NODE_ENV === "development" ? false : true,
    }).status(200).json({message : "Logout Successfully"})

}


// userVerification controller
export const userVerification = async (req, res) => {

    const { userCode } = req.body
    console.log(userCode, "<----user code");

    try {

        const verifiedUserUpdate = await Users.updateOne({ verificationCode: userCode }, {
            $set: {
                isVerified: true
            },
            $unset: {
                verificationCode: ""
            }
        })

        if (verifiedUserUpdate.matchedCount === 0) return errorHandler(res, 404, "Invalid Code")  // is ka matlab  { verificationCode: userCode } esa koi document nahi mila

        console.log(verifiedUserUpdate, "<----verifiedUserUpdate verified user update res");
        successHandler(res, 200, "User verified successfully", verifiedUserUpdate)
    }
    catch (err) {
        console.log(err);
        errorHandler(res, 404, "User not verified", err)
    }
}


// verificationCodeDeleted controller
export const verificationCodeDeleted = async (req, res) => {

    try {
        const { email } = req.body
        // console.log(email , "email jis ka varification code dekte kar na he ");

        const verificationCodeDeleted = await Users.updateOne({ email: email }, {
            $unset: {
                verificationCode: ""
            }
        })

        if (verificationCodeDeleted.matchedCount === 0) return errorHandler(res, 404, "User Not Found", res.error)
        // console.log(verificationCodeDeleted , "user ka ceriifcation code dleete ho gaya he ");

        successHandler(res, 200, "User verification code deleted successfully", verificationCodeDeleted)
    }
    catch (err) {
        console.log(err, "<--- verificationCodeDeleterAfter3m  error he");
        errorHandler(res, 404, "user not found", err)
    }

}


// resendCode controller
export const resendCode = async (req, res) => {

    try {
        const { email } = req.body
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const resendCodeSend = await Users.updateOne({ email: email }, {
            $set: {
                verificationCode
            }
        })

        if (resendCodeSend.matchedCount === 0) return errorHandler(res, 404, "User Not Found", resendCodeSend.error)

        sendVerificationEmail(email, verificationCode.toString())
        return successHandler(res, 200, "User verification code resend successfully", resendCodeSend)
    }
    catch (err) {
        console.log(err, "<--- resendCode  error he");
        errorHandler(res, 404, "user not found , verification code can not resend", err)
    }

}


