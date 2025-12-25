import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {
  authenticateUser,
  deauthenticateUser,
  fetchUserInfo,
  refreshToken,
  registerUser,
  updateUserPassword,
} from "@services/auth.service";

import {
  RegistrationError,
  AuthenticationError,
  NotFoundError,
  AccountUpdateError,
} from "@utils/customErrors";
import { errorResponse, successResponse } from "@utils/responseHandler";
import { env } from "@/configs/env.config";

export const handleRegistration = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array());
  }

  const data = matchedData(req);

  const { email, first_name, last_name, password, confirm_password } = data as {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
  };

  if (password !== confirm_password) {
    return errorResponse(res, 400, "Passwords do not match");
  }

  try {
    const { user, refreshToken, accessToken } = await registerUser(
      email,
      first_name,
      last_name,
      password,
      "USER",
      req.ip as string,
      req.headers["user-agent"] || ""
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, "Registration successful", {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (env.NODE_ENV === "DEVELOPMENT" && error.name === "JsonWebTokenError") {
      return errorResponse(res, 500, error.message);
    }

    if (error instanceof RegistrationError) {
      return errorResponse(res, 401, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 422, errors.array());
  }

  const data = matchedData(req);

  const { email, password } = data as { email: string; password: string };

  try {
    const { user, refreshToken, accessToken } = await authenticateUser(
      email,
      password,
      req.ip as string,
      req.headers["user-agent"] || ""
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Login successful", {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (env.NODE_ENV === "DEVELOPMENT" && error.name === "JsonWebTokenError") {
      return errorResponse(res, 500, error.message);
    }

    if (error instanceof AuthenticationError) {
      return errorResponse(res, 401, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    const ip_address = req.ip;
    const user_agent = req.headers["user-agent"] || "";

    await deauthenticateUser(
      refresh_token,
      ip_address as string,
      user_agent as string
    );

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
    });

    return successResponse(res, 200, "User logged out successfully");
  } catch (error: any) {
    if (env.NODE_ENV === "DEVELOPMENT" && error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 400, error.message);
    }

    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 401, error.message);
    }

    if (error instanceof AuthenticationError) {
      return errorResponse(res, 401, error.message);
    }

    if (error instanceof NotFoundError) {
      return errorResponse(res, 404, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};

export const handleGetUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };

    const user = await fetchUserInfo(id);

    return successResponse(res, 200, "Welcome User", { user });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return errorResponse(res, 404, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};

export const handlePasswordUpdate = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array());
  }

  const data = matchedData(req);

  try {
    const { user_id, password, confirmPassword } = data as {
      user_id: string;
      password: string;
      confirmPassword: string;
    };

    await updateUserPassword(user_id, password, confirmPassword);

    return successResponse(res, 200, "Password updated successfully");
  } catch (error: any) {
    if (error instanceof AccountUpdateError) {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const handleTokenRefresh = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    const accessToken = await refreshToken(
      refresh_token,
      req.ip as string,
      req.headers["user-agent"] || ""
    );

    return successResponse(res, 200, "Access Token Refreshed Successfully", {
      access_token: accessToken,
    });
  } catch (error: any) {
    if (env.NODE_ENV === "DEVELOPMENT" && error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 400, error.message);
    }

    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 401, error.message);
    }

    if (error instanceof AuthenticationError) {
      return errorResponse(res, 401, error.message);
    }

    if (error instanceof NotFoundError) {
      return errorResponse(res, 404, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};
