import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "@/config/prismaConfig";
import { hashRefreshToken } from "@/utils/tokenHashing";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

/**
 * This function generates an access token using the provided payload.
 * The access token is signed with a secret and has a validity of 3 hours.
 * It includes the user's ID, email, and role in the token payload.
 * @param tokenPayload - The payload containing user_id, email, and role.
 * @returns A signed JWT access token.
 */
export const generateAccessToken = (
  tokenPayload: AccessTokenPayloadTypes
): string => {
  const SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!SECRET) throw new Error("JWT Access Token Secret is not defined.");

  const { user_id, email, role } = tokenPayload;

  if (!user_id || !email || !role) {
    throw new Error("Invalid token payload for access token generation.");
  }

  return jwt.sign({ user_id, email, role }, SECRET, {
    expiresIn: "3h",
  });
};

/**
 * This function generates a refresh token and sets it as a cookie in the response.
 * The refresh token is signed with a secret and has a validity of 7 days.
 * It also stores the token in the database with additional metadata.
 * @param user_id - The ID of the user for whom the refresh token is generated.
 * @param ip - The IP address of the user.
 * @param user_agent - The user agent string of the user's device.
 * @return A promise that resolves to an object containing the token, token_id, and expiration date.
 */
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

  const hashed = await hashRefreshToken(token);

  await prisma.refresh_token.create({
    data: {
      id: token_id,
      user_id,
      token: hashed,
      ip_address: ip,
      user_agent: user_agent || "Unknown Device",
      device: user_agent || "Unknown Device",
      expires_at,
    },
  });

  return token;
};
