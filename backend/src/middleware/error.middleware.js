import { env } from "../config/env.js";

export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: error.status || (statusCode >= 500 ? "error" : "fail"),
    message:
      env.nodeEnv === "production"
        ? "An unexpected error occurred."
        : error.message,
  });
}
