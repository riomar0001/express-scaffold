import { Request, Response } from "express";
import prisma from "@configs/prisma.config";
import jwt from "jsonwebtoken";
import { verifyHashedRefreshToken } from "@utils/tokenHashing";
import "@configs/env.config";

export const logout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;

    const forbidden = () =>
      res.status(403).json({ message: "Invalid or expired refresh token" });

    if (!refresh_token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const verifyToken = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_TOKEN_SECRET as string
    ) as {
      token_id?: string;
      user_id?: string;
    };

    if (!verifyToken || !verifyToken.token_id || !verifyToken.user_id) {
      return forbidden();
    }

    const tokenExists = await prisma.refresh_token.findUnique({
      where: { id: verifyToken.token_id },
    });

    if (!tokenExists) {
      return forbidden();
    }

    if (!tokenExists?.is_active) {
      return forbidden();
    }

    if (new Date(tokenExists.expires_at) < new Date()) {
      return forbidden();
    }

    const validToken = await verifyHashedRefreshToken(
      refresh_token,
      tokenExists.token
    );

    if (!validToken) {
      return forbidden();
    }

    await prisma.refresh_token.update({
      where: { id: tokenExists.id },
      data: {
        is_active: false,
      },
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
