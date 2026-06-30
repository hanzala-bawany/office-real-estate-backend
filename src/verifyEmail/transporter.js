import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "hbawany1@gmail.com", 
        pass: "yhdy aktk wyii sviq",
    },
});

