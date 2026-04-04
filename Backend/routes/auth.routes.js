import express from "express";
import { body } from "express-validator";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from "../controllers/auth.controllers.js";
import { authLimiter, otpLimiter } from "../middlewares/rateLimiter.js";
import validate from "../middlewares/validate.js";

const authRouter = express.Router();

// ─── Validation Rule Sets ────────────────────────────────────────────────────

const signUpRules = [
  body("fullname")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("mobile")
    .trim()
    .notEmpty().withMessage("Mobile number is required")
    .isMobilePhone("any").withMessage("Invalid mobile number"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "owner", "deliveryBoy"]).withMessage("Invalid role"),
];

const signInRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

const emailRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
];

const verifyOtpRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers"),
];

const resetPasswordRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Must contain at least one number"),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// authLimiter: max 10 attempts per 15 min (brute-force protection)
authRouter.post("/signup",  authLimiter, signUpRules,       validate, signUp);
authRouter.post("/signin",  authLimiter, signInRules,       validate, signIn);
authRouter.get( "/signout", signOut);

// otpLimiter: max 5 OTP requests per 15 min
authRouter.post("/send-otp",         otpLimiter,  emailRules,         validate, sendOtp);
authRouter.post("/verify-otp",       otpLimiter,  verifyOtpRules,     validate, verifyOtp);
authRouter.post("/reset-password",   authLimiter, resetPasswordRules, validate, resetPassword);

// Google Auth
authRouter.post("/google-auth", authLimiter, googleAuth);

export default authRouter;