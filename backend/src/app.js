import express from "express";

import cors from "cors";

import helmet from "helmet";

import cookieParser from "cookie-parser";

import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";

const app = express();

// Security headers.
app.use(helmet());

// CORS configuration.
app.use(
  cors({
    origin: env.FRONTEND_URL,

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// Request body parsing.
app.use(
  express.json({
    limit: "10kb",
  }),
);

// Cookie parsing.
app.use(cookieParser());

// Basic API rate limiting.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 200,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    status: "error",

    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// API routes.
app.use("/api/health", healthRoutes);

// Root endpoint.
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",

    message: "Coaching Center Management API",
  });
});

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    status: "error",

    message: "API endpoint not found.",
  });
});

// Central error handler.
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.status || 500;

  res.status(statusCode).json({
    status: "error",

    message:
      env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : error.message,
  });
});

export default app;
