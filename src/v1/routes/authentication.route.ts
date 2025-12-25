import express from "express";
import { checkSchema } from "express-validator";
import * as authValidation from "@validators/authValidationSchema";
import { authMiddleware } from "@middlewares/auth.middleware";
import {
  authRateLimiter,
  registrationRateLimiter,
} from "@middlewares/rateLimiter.middleware";
import * as authController from "@controllers/auth.controller";

const router = express.Router();

router.post(
  "/register",
  checkSchema(authValidation.registrationValidators),
  registrationRateLimiter,
  authController.handleRegistration
);
router.post(
  "/",
  checkSchema(authValidation.authenticationValidators),
  authRateLimiter,
  authController.handleLogin
);
router.post("/logout", authController.handleLogout);
router.get("/profile", authMiddleware, authController.handleGetUserInfo);
router.post(
  "/update-password",
  authMiddleware,
  authController.handlePasswordUpdate
);
router.post("/refresh", authController.handleTokenRefresh);

export default router;
