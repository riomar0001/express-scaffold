import { Request, Response } from "express";
import prisma from "@/config/prismaConfig";
import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "@/utils/passwordHashing";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/tokenGenerations";
import { truncateIp } from "@/utils/truncateIP";

export const registration = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  const { email, password } = data as { email: string; password: string };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });

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

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: user.id,
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
