const isProd = process.env.NODE_ENV === "production";

/**
 * Centralized Express error handler.
 * - In production: hides internal error details from client
 * - In development: shows full error message for debugging
 * Place this LAST in index.js after all routes.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log for server-side debugging always
  console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);

  return res.status(status).json({
    success: false,
    message: isProd
      ? status < 500
        ? err.message          // 4xx: safe to show (validation/auth errors)
        : "Something went wrong. Please try again later." // 5xx: hide internals
      : err.message,           // development: show everything
    ...(isProd ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
