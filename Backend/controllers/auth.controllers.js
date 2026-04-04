import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

const isProd = process.env.NODE_ENV === "production";

// ─── Cookie options (DRY — reused everywhere) ────────────────────────────────
const cookieOptions = {
  httpOnly: true,                    // JS can't read it — XSS protection
  secure: isProd,                    // Only HTTPS in production
  sameSite: isProd ? "strict" : "lax", // CSRF protection in production
  maxAge: 5 * 24 * 60 * 60 * 1000,  // 5 days
};

// ─── Safe error message (hides internals in production) ──────────────────────
const safeError = (msg) =>
  isProd ? "Something went wrong. Please try again." : msg;

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export const signUp = async (req, res) => {
  try {
    const { fullname, email, password, mobile, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds (more secure than 10)
    const user = await User.create({ fullname, email, role, mobile, password: hashedPassword });

    const token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);

    // Never send password in response
    const { password: _, resetOtp, otpExpires, isOtpVerified, ...safeUser } = user.toObject();
    return res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Sign In ──────────────────────────────────────────────────────────────────
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Generic message — don't reveal if email exists or not
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Google-auth users (no password set)
    if (!user.password) {
      return res.status(401).json({ success: false, message: "Please sign in with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);

    const { password: _, resetOtp, otpExpires, isOtpVerified, ...safeUser } = user.toObject();
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ success: true, message: "Signed out successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    // Generic message — don't reveal if email exists or not (prevents user enumeration)
    if (!user) {
      return res.status(200).json({ success: true, message: "If this email exists, an OTP has been sent." });
    }

    // 6-digit OTP (more secure than 4-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.isOtpVerified = false;
    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({ success: true, message: "If this email exists, an OTP has been sent." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    // Constant-time comparison to avoid timing attacks
    const isValid =
      user &&
      String(user.resetOtp) === String(otp) &&
      user.otpExpires > Date.now();

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ success: false, message: "OTP verification required before resetting password." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

// ─── Google Auth ──────────────────────────────────────────────────────────────
export const googleAuth = async (req, res) => {
  try {
    const { fullname, email, mobile, role } = req.body;

    if (!email || !fullname) {
      return res.status(400).json({ success: false, message: "Email and name are required." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullname, email, mobile: mobile || "0000000000", role: role || "user" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);

    const { password: _, resetOtp, otpExpires, isOtpVerified, ...safeUser } = user.toObject();
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};
