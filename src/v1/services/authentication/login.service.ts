import { Request, Response } from "express";
import { verifyPassword } from "@/utils/passwordHashing";
import prisma from "@/config/prismaConfig";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/tokenGenerations";
import { truncateIp } from "@/utils/truncateIP";
import { AuthenticationError } from "@/utils/customErrors";

export const loginService = async (
  email: string,
  password: string,
  ip_address: string,
  userAgent: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid credentials");
  }

  const truncatedIp = truncateIp(ip_address);
  const user_agent = userAgent || "";

  const refreshToken = await generateRefreshToken(
    user.id,
    truncatedIp as string,
    user_agent
  );

  const accessToken = generateAccessToken({
    user_id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};
