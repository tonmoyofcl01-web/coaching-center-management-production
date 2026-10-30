import { Router } from "express";

import {
  getTeacherDashboardStats,
  getTeacherBatches,
  getTeacherSchedule,
} from "./teacherDashboard.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("TEACHER"));

router.get("/stats", getTeacherDashboardStats);
router.get("/batches", getTeacherBatches);
router.get("/schedule", getTeacherSchedule);

export default router;
