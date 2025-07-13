import jwt from "jsonwebtoken";
import prisma from "@configs/prisma.config";
import { hashRefreshToken } from "@/utils/tokenHashing";
import { v4 as uuidv4 } from "uuid";
import { AccessTokenPayload } from "@/types/token";
import "@/configs/dotenv.config";
import { sign } from "jsonwebtoken";

export const generateAccessToken = (
  tokenPayload: AccessTokenPayload
): string => {
  const SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) throw new Error("JWT Access Token Secret is not defined.");

  const { user_id, email, role } = tokenPayload;

  if (!user_id || !email || !role) {
    throw new Error("Invalid token payload for access token generation.");
  }

  return sign({ user_id, email, role }, SECRET, {
    expiresIn: "3h",
  });
};

export const generateRefreshToken = async (
  user_id: string,
  ip: string,
  user_agent: string
) => {
  const SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!SECRET) throw new Error("JWT refresh secret not defined");

  const token_id = uuidv4();

  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = jwt.sign({ token_id, user_id }, SECRET, {
    expiresIn: "7d",
  });

  const hashedToken = await hashRefreshToken(token);

  await prisma.refresh_token.create({
    data: {
      id: token_id,
      user_id,
      token_hash: hashedToken,
      ip_address: ip,
      user_agent: user_agent || "Unknown Device",
      device: user_agent || "Unknown Device",
      expires_at,
      last_used: new Date(),
    },
  });

  return token;
};
