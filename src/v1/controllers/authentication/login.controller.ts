import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { loginService } from "@services/authentication/login.service";
import { AuthenticationError } from "@utils/customErrors";
import { errorResponse, successResponse } from "@utils/responseHandler";

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 422, errors.array());
  }

  const data = matchedData(req);

  const { email, password } = data as { email: string; password: string };

  try {
    const { user, refreshToken, accessToken } = await loginService(
      email,
      password,
      req.ip as string,
      req.headers["user-agent"] || ""
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
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
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, 500, error.message);
      }
    }

    if (error instanceof AuthenticationError) {
      return errorResponse(res, 401, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};
