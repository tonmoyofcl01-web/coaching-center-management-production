import { env } from "../config/env.js";

export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.status || error.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message:
      env.nodeEnv === "production"
        ? "An unexpected error occurred."
        : error.message,
  });
}
