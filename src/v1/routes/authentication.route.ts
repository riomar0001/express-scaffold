import express from "express";
import { checkSchema } from "express-validator";
import {
  registrationValidators,
  authenticationValidators,
} from "@validators/authValidationSchema";
import { authMiddleware } from "@middlewares/auth.middleware";
import {
  authRateLimiter,
  registrationRateLimiter,
} from "@middlewares/rateLimiter.middleware";
import {
  handleGetUserInfo,
  handleLogin,
  handleLogout,
  handlePasswordUpdate,
  handleRegistration,
  handleTokenRefresh,
} from "@controllers/auth.controller";

const router = express.Router();

router.post(
  "/register",
  checkSchema(registrationValidators),
  registrationRateLimiter,
  handleRegistration
);
router.post(
  "/",
  checkSchema(authenticationValidators),
  authRateLimiter,
  handleLogin
);
router.post("/logout", handleLogout);
router.get("/profile", authMiddleware, handleGetUserInfo);
router.post("/update-password", authMiddleware, handlePasswordUpdate);
router.post("/refresh", handleTokenRefresh);

export default router;
