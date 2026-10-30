import { Router } from "express";

import { login, logout, getCurrentUser } from "./auth.controller.js";

import { loginSchema } from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), login);

router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

export default router;
