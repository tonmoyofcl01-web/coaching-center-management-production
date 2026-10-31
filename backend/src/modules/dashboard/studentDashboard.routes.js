import { Router } from "express";

import {
  getStudentDashboardStats,
  getStudentBatches,
  getStudentSchedule,
} from "./studentDashboard.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

// All Student Dashboard routes require Student authentication.
router.use(authenticate, authorizeRoles("STUDENT"));

router.get("/stats", getStudentDashboardStats);

router.get("/batches", getStudentBatches);

router.get("/schedule", getStudentSchedule);

export default router;
