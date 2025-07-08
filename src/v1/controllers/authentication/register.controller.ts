import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { registerService } from "@/v1/services/authentication/register.service";
import { RegistrationError } from "@/utils/customErrors";
import { errorResponse, successResponse } from "@/utils/responseHandler";

export const registration = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array(), 400);
  }

  const data = matchedData(req);

  const { email, password } = data as { email: string; password: string };

  try {
    const { user, refreshToken, accessToken } = await registerService(
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

    return successResponse(res, 201, "Registration successful", {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {

    // If in development mode, return detailed error messages for debugging :)
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, error.message, 500);
      }
    }

    if (error instanceof RegistrationError) {
      return errorResponse(res, error.message, 401);
    }

    return errorResponse(res, "Internal server error", 500);
  }
};
