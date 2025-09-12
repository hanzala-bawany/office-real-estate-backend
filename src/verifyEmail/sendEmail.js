import { verificatioTmpelat, welcomeEmailTemplate } from "./verificationTempelate.js";
import { transporter } from "./transporter.js";

export const sendVerificationEmail = async (userEmail , verificationCode) => {

    try {
        const info = await transporter.sendMail({
            from: '"Bawany Real Estate" <hbawany1@gmail.com>',
            to: userEmail ,
            subject: "Verify Your Email",
            text: "Verify Your Email", // plain‑text body
            html: verificatioTmpelat(verificationCode) , // HTML body
        });

        console.log("Verify Email Message sent Successfully:", info.messageId);
    }
    catch(err){
        console.log(err);
    }

}

export const sendWelcomeEmail = async (userEmail , userName) => {

    try {
        const info = await transporter.sendMail({
            from: '"Bawany Real Estate" <hbawany1@gmail.com>',
            to: userEmail  ,
            subject: "Welcome Email",
            text: "Welcome To Bawany Real Estate", // plain‑text body
            html: welcomeEmailTemplate(userName,"Bawany Real Estate","http://localhost:5173/") , // HTML body
        });

        console.log("Welcome Email Message sent Successfully:", info.messageId);
    }
    catch(err){
        console.log(err);
    }

}
