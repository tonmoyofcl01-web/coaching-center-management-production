import { Router } from "express";

import { checkOracleConnection } from "../db/oracle.js";

const router = Router();

// Liveness check: verifies that Express is running.
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "success",

    message: "Backend server is running.",

    timestamp: new Date().toISOString(),
  });
});

// Readiness check: verifies that Oracle is accessible.
router.get("/", async (req, res) => {
  try {
    const databaseConnected = await checkOracleConnection();

    if (!databaseConnected) {
      return res.status(503).json({
        status: "error",

        message: "Database is unavailable.",
      });
    }

    return res.status(200).json({
      status: "success",

      message: "Backend and database are operational.",

      services: {
        backend: "connected",

        database: "connected",
      },

      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    return res.status(503).json({
      status: "error",

      message: "Service temporarily unavailable.",
    });
  }
});

export default router;
