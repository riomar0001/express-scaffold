import prisma from "@/config/prismaConfig";
import { hashPassword } from "@/utils/passwordHashing";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/tokenGenerations";
import { truncateIp } from "@/utils/truncateIP";
import { RegistrationError } from "@/utils/customErrors";

export const registerService = async (
  email: string,
  password: string,
  ip_address: string,
  userAgent: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new RegistrationError("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const truncatedIp = truncateIp(ip_address);
  const user_agent = userAgent || "";

  const accessToken = generateAccessToken({
    user_id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken(
    user.id,
    truncatedIp as string,
    user_agent
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
