import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import teacherDashboardRoutes from "../modules/dashboard/teacherDashboard.routes.js";
import studentDashboardRoutes from "../modules/dashboard/studentDashboard.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teacher-dashboard", teacherDashboardRoutes);
router.use("/student-dashboard", studentDashboardRoutes);

export default router;
