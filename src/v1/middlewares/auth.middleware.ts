import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import prisma from "@/config/prismaConfig";
import { errorResponse } from "@/utils/responseHandler";
dotenv.config();

/**
 * Middleware to authenticate user based on JWT token.
 * It checks for the presence of a Bearer token in the Authorization header,
 * verifies the token, and retrieves the user from the database.
 * If the user is found and the token is valid, it attaches the user info to the request object.
 * Otherwise, it returns an appropriate error response.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  const SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;

  try {
    const decoded = jwt.verify(token, SECRET) as {
      user_id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.user_id },
    });

    if (!user) {
      return errorResponse(res, 403, "Invalid token or unauthorized");
    }

    if (user.email !== decoded.email || user.role !== decoded.role) {
      return errorResponse(res, 403, "Invalid token or unauthorized");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Access token expired");
    }
    return errorResponse(res, 403, "Invalid token or unauthorized");
  }
};
