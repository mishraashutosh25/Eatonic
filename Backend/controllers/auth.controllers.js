import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";


export const signUp = async (req, res) => {
        try {
                const { fullname, email, password, mobile, role } = req.body;
                let user = await User.findOne({ email })
                if (user) {
                        return res.status(400).json({ message: "User Already Exits" })
                }
                if (password.length < 6) {
                        return res.status(400).json({ message: "Password must be at least 6 characters." })
                }
                if (mobile.length < 10) {
                        return res.status(400).json({ message: "Mobile number must be at least 10 digits." })
                }

                const hashedPassword = await bcrypt.hash(password, 10)
                user = await User.create({
                        fullname,
                        email,
                        role,
                        mobile,
                        password: hashedPassword
                })


                const token = await genToken(user._id)
                res.cookie("token", token, {
                        secure: false,
                        sameSite: "strict",
                        maxAge: 5 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                })
                return res.status(201).json(user)
        }
        catch (error) {
                return res.status(500).json(`Signup failed. Please try again later. ${error.message}`);

        }

};

export const signIn = async (req, res) => {
        try {
                const { email, password } = req.body;
                const user = await User.findOne({ email })
                if (!user) {
                        return res.status(400).json({ message: "User does not exist" })
                }
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                        return res.status(400).json({ message: "Invalid credentials" })
                }


                const token = await genToken(user._id)
                res.cookie("token", token, {
                        secure: false,
                        sameSite: "strict",
                        maxAge: 5 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                })
                return res.status(201).json(user)
        }
        catch (error) {
                return res.status(500).json(`sign In failed. Please try again later. ${error.message}`);

        }

};

export const signOut = async (req, res) => {
        try {
                res.clearCookie("token")
                return res.status(200).json({ message: "Signed out successfully" })
        } catch (error) {
                return res.status(500).json(`Sign out failed. Please try again later. ${error.message}`);
        }
};

export const sendOtp = async (req, res) => {
        try {
                const { email } = req.body;

                const user = await User.findOne({ email });
                if (!user) {
                        return res.status(400).json({ message: "User does not exist" });
                }

                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                user.resetOtp = otp;
                user.otpExpires = Date.now() + 10 * 60 * 1000;
                await user.save();

                await sendOtpMail(email, otp);

                return res.status(200).json({ message: "OTP sent successfully" });

        } catch (error) {
                console.error("SEND OTP ERROR 👉", error);
                return res.status(500).json({
                        message: `Send OTP failed. Please try again later. ${error.message}`,
                });
        }
};

export const verifyOtp = async (req, res) => {
        try {
                const { email, otp } = req.body;

                const user = await User.findOne({ email });

                if (
                        !user ||
                        String(user.resetOtp) !== String(otp) ||
                        user.otpExpires < Date.now()
                ) {
                        return res.status(400).json({ message: "Invalid or expired OTP" });
                }

                user.isOtpVerified = true;
                user.resetOtp = undefined;
                user.otpExpires = undefined;

                await user.save();

                return res.status(200).json({ message: "OTP verified successfully" });
        } catch (error) {
                return res
                        .status(500)
                        .json({ message: `Verify OTP failed. ${error.message}` });
        }
};

export const resetPassword = async (req, res) => {
        try {
                const { email, newPassword } = req.body;
                const user = await User.findOne({ email });
                if (!user || !user.isOtpVerified) {
                        return res.status(400).json({ message: "OTP not verified" })
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                user.isOtpVerified = false;
                await user.save();
                return res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
                return res.status(500).json(`Reset Password failed. Please try again later. ${error.message}`);
        }
};

export const googleAuth = async (req, res) => {
        try {
                const { fullname, email, mobile } = req.body;
                let user = await User.findOne({ email })
                if (!user) {
                        user = await User.create({
                                fullname, email, mobile
                        })
                        const token = await genToken(user._id)
                        res.cookie("token", token, {
                                secure: false,
                                sameSite: "strict",
                                maxAge: 5 * 24 * 60 * 60 * 1000,
                                httpOnly: true
                        })
                        return res.status(201).json(user)

                }


        } catch (error) {
                return res.status(500).json(`Google Auth failed. Please try again later. ${error.message}`);

        }
};

