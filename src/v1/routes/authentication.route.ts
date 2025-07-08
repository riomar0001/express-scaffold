import express from "express";
import { checkSchema } from "express-validator";
import { registrationValidators } from "@/v1/validators/authValidationSchema";
import { authenticationValidators } from "@/v1/validators/authValidationSchema";

import { authMiddleware } from "@/v1/middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";
import { checkRole } from "../middlewares/role.middleware";

import { admin } from "@/v1/controllers/authentication/admin.controller";
import { user } from "@/v1/controllers/authentication/user.controller";

import { UserRole } from "@/constants/userRole";

import {
  authentication,
  registration,
  refreshTokenController,
  logout,
} from "@/v1/controllers/authentication";

const router = express.Router();

router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, checkRole(UserRole.ADMIN), admin);

router.post(
  "/",
  checkSchema(authenticationValidators),
  authRateLimiter,
  authentication
);
router.post("/register", checkSchema(registrationValidators), registration);
router.post("/refresh", refreshTokenController);
router.post("/logout", logout);

export default router;
