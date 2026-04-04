import User from "../models/user.model.js";

const isProd = process.env.NODE_ENV === "production";
const safeError = (msg) => isProd ? "Something went wrong. Please try again." : msg;

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -resetOtp -otpExpires -isOtpVerified");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};