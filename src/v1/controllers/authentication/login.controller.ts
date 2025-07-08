import { Request, Response } from "express";
import prisma from "@/config/prismaConfig";
import { matchedData, validationResult } from "express-validator";
import { verifyPassword } from "@/utils/passwordHashing";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/tokenGenerations";
import { truncateIp } from "@/utils/truncateIP";

export const authentication = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  const { email, password } = data as { email: string; password: string };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ip_address = req.ip as string;
    const truncatedIp = truncateIp(ip_address);
    const user_agent = req.headers["user-agent"] || "";

    const { token: refreshToken } = await generateRefreshToken(
      user.id,
      truncatedIp as string,
      user_agent
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "User authenticated successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      if (error.name === "JsonWebTokenError") {
        return res.status(500).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
