import express from "express";
import { checkSchema } from "express-validator";
import { registrationValidators } from "@validators/authValidationSchema";
import { authenticationValidators } from "@validators/authValidationSchema";

import { authMiddleware } from "@middlewares/auth.middleware";
import {
  authRateLimiter,
  registrationRateLimiter,
} from "@middlewares/rateLimiter.middleware";
import { checkRole } from "@middlewares/role.middleware";

import { admin } from "@controllers/authentication/admin.controller";
import { user } from "@controllers/authentication/user.controller";

import { UserRole } from "@/constants/userRole";

import {
  login,
  registration,
  refreshToken,
  logout,
} from "@controllers/authentication";

const router = express.Router();

router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, checkRole(UserRole.ADMIN), admin);
 
router.post("/", checkSchema(authenticationValidators), authRateLimiter, login);
router.post(
  "/register",
  checkSchema(registrationValidators),
  registrationRateLimiter,
  registration
);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
