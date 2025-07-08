import { Request, Response } from "express";
import prisma from "@/config/prismaConfig";
import { generateAccessToken } from "@/utils/tokenGenerations";
import jwt from "jsonwebtoken";
import { verifyHashedRefreshToken } from "@/utils/tokenHashing";
import dotenv from "dotenv";
dotenv.config();

export const refreshToken = async (req: Request, res: Response) => {
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

    const user = await prisma.user.findUnique({
      where: { id: tokenExists.user_id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      access_token: accessToken,
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(500).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
