import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";

const app = express();

// Security middleware.
app.use(helmet());

// CORS configuration.
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// Request parsing.
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// API rate limiting.
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

// Central API routes.
app.use("/api", apiRoutes);

// Root route.
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Coaching Center Management API",
  });
});

// 404 and error handling.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
