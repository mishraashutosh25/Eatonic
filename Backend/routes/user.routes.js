import express from "express";
import multer from "multer";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

// Multer for avatar upload (memory → Cloudinary)
const upload = multer({ dest: "uploads/" });

// ── Routes ─────────────────────────────────────────
userRouter.get("/current",         isAuth,                       getCurrentUser);
userRouter.put("/profile",         isAuth, upload.single("avatar"), updateProfile);
userRouter.put("/change-password", isAuth,                       changePassword);
userRouter.delete("/account",      isAuth,                       deleteAccount);

export default userRouter;