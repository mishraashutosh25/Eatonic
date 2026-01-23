import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
        },
});
console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");




export const sendOtpMail = async (to, otp) => {
        const info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject: "Reset Your Password",
                html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`
        });

        console.log("Message sent:", info.messageId);
};