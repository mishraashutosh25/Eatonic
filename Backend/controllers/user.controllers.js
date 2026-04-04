import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const isProd = process.env.NODE_ENV === "production";
const safeError = (msg) => isProd ? "Something went wrong. Please try again." : msg;

/* ─── GET current user ─────────────────────────────────────────────────── */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password -resetOtp -otpExpires -isOtpVerified")
      .lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

/* ─── UPDATE profile (fullname, mobile, avatar) ────────────────────────── */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, mobile } = req.body;

    const updateData = {};
    if (fullname && fullname.trim()) updateData.fullname = fullname.trim();
    if (mobile  && mobile.trim())   updateData.mobile   = mobile.trim();

    // If avatar image was uploaded via Multer
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded?.secure_url) updateData.avatar = uploaded.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true }
    ).select("-password -resetOtp -otpExpires -isOtpVerified").lean();

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.status(200).json({ success: true, message: "Profile updated successfully.", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

/* ─── CHANGE password ──────────────────────────────────────────────────── */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both current and new password are required." });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Google-auth users may not have a password
    if (!user.password)
      return res.status(400).json({ success: false, message: "This account uses Google Sign-In. Password cannot be changed." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Current password is incorrect." });

    if (currentPassword === newPassword)
      return res.status(400).json({ success: false, message: "New password must be different from current password." });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

/* ─── DELETE account ───────────────────────────────────────────────────── */
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // If user has a password, verify it before deleting
    if (user.password) {
      if (!password)
        return res.status(400).json({ success: false, message: "Password is required to delete your account." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    await User.findByIdAndDelete(req.userId);

    // Clear auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProd ? "strict" : "lax",
      secure: isProd,
    });

    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};