import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/item",itemRouter)
app.use("/api/shop",shopRouter)
app.listen(port, () => {
        connectDb();
        console.log(`Server is running on port ${port}`);
})




