import { Router } from "express";

import {
  getDashboardStats,
  getMonthlyRevenue,
  getRecentActivity,
  getEnrollmentSummary,
} from "./dashboard.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("ADMIN"), getDashboardStats);

router.get(
  "/revenue",
  authenticate,
  authorizeRoles("ADMIN"),
  getMonthlyRevenue,
);

router.get(
  "/activity",
  authenticate,
  authorizeRoles("ADMIN"),
  getRecentActivity,
);

router.get(
  "/enrollments",
  authenticate,
  authorizeRoles("ADMIN"),
  getEnrollmentSummary,
);

export default router;
