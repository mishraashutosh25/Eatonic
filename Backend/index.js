import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const port = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === "production";

// ─── Connect to Database BEFORE starting server ────────────────────────────
connectDb();

// ─── Security Middlewares ───────────────────────────────────────────────────

// 1. Helmet — sets secure HTTP headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// 2. CORS — origin from .env (never hardcoded)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body parser with size limit (prevents large payload DoS attacks)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 4. General rate limiter on ALL routes
app.use(generalLimiter);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);
app.use("/api/shop", shopRouter);
app.use("/api/order", orderRouter);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Centralized Error Handler (must be LAST) ───────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} [${process.env.NODE_ENV || "development"}]`);
});
