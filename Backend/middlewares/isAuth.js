import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is not set in environment variables!");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please sign in again.",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    // TokenExpiredError | JsonWebTokenError
    const isExpired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: isExpired
        ? "Session expired. Please sign in again."
        : isProd
        ? "Authentication failed."
        : `Authentication failed: ${error.message}`,
    });
  }
};

export default isAuth;
