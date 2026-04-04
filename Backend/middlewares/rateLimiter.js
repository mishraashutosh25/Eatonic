import rateLimit from "express-rate-limit";

/**
 * Strict limiter — for login / signup / OTP endpoints
 * Max 10 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this IP. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * OTP limiter — stricter — 5 attempts per 15 minutes
 * Prevents OTP brute-force
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests from this IP. Please wait 15 minutes.",
  },
});

/**
 * General API limiter — for all other routes
 * Max 100 requests per 5 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  skipSuccessfulRequests: true,
});
