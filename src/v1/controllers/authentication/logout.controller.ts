import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logoutService } from "@/v1/services/authentication/logout.service";
import { AuthenticationError, NotFoundError } from "@/utils/customErrors";
import { successResponse, errorResponse } from "@/utils/responseHandler";
import "@/configs/dotenv.config";

export const logout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    const ip_address = req.ip;
    const user_agent = req.headers["user-agent"] || "";

    const logoutResult = await logoutService(
      refresh_token,
      ip_address as string,
      user_agent as string
    );

    if (!logoutResult) {
      return errorResponse(res, 400, "Logout failed");
    }

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
    });

    return successResponse(res, 200, "User logged out successfully");
  } catch (error: any) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      if (error instanceof jwt.JsonWebTokenError) {
        return errorResponse(res, 400, error.message);
      }
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

    return res.status(500).json({ message: "Internal server error" });
  }
};
