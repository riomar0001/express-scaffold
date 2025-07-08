import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { refreshService } from "@/v1/services/authentication/refresh.service";
import { AuthenticationError, NotFoundError } from "@/utils/customErrors";
import { errorResponse, successResponse } from "@/utils/responseHandler";
import dotenv from "dotenv";
dotenv.config();

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    const accessToken = await refreshService(
      refresh_token,
      req.ip as string,
      req.headers["user-agent"] as string
    );

    return successResponse(res, 200, "Access Token Refreshed Successfully", {
      access_token: accessToken,
    });
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
