import prisma from "@configs/prisma.config";
import { generateAccessToken } from "@utils/tokenGenerations";
import jwt from "jsonwebtoken";
import { verifyHashedRefreshToken } from "@utils/tokenHashing";
import { EmptyTokenError, NotFoundError } from "@utils/customErrors";
import { AuthenticationError } from "@utils/customErrors";
import { RefreshTokenPayload } from "@/types/token";
import { truncateIp } from "@utils/truncateIP";
import "@/configs/dotenv.config";

export const logoutService = async (
  refresh_token: string,
  ip_address: string,
  user_agent: string
): Promise<boolean> => {
  if (!refresh_token) {
    throw new EmptyTokenError("Refresh token is required");
  }

  const SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;

  let verifyToken: RefreshTokenPayload;

  let expiredAt: Date | undefined;

  try {
    verifyToken = jwt.verify(refresh_token, SECRET) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      expiredAt = error.expiredAt;

      throw new jwt.TokenExpiredError("Refresh token has expired", expiredAt);
    }

    throw new AuthenticationError("Invalid refresh token format");
  }

  if (!verifyToken) {
    throw new jwt.TokenExpiredError(
      "Invalid or expired refresh token",
      expiredAt || new Date()
    );
  }

  const verifyTokenDBExist = await prisma.refresh_token.findUnique({
    where: { id: verifyToken.token_id },
  });

  if (!verifyTokenDBExist) {
    throw new NotFoundError("Refresh token not found");
  }

  if (!verifyTokenDBExist.is_active) {
    throw new AuthenticationError("Refresh token has been revoked");
  }

  if (new Date(verifyTokenDBExist.expires_at) < new Date()) {
    throw new jwt.TokenExpiredError(
      "Refresh token has expired",
      verifyTokenDBExist.expires_at
    );
  }

  if (
    verifyTokenDBExist.ip_address !== truncateIp(ip_address) ||
    verifyTokenDBExist.user_agent !== user_agent
  ) {
    throw new AuthenticationError("Refresh token is not valid for this device");
  }

  const validateHashedToken = await verifyHashedRefreshToken(
    refresh_token,
    verifyTokenDBExist.token_hash
  );

  if (!validateHashedToken) {
    throw new AuthenticationError("Invalid refresh token");
  }

  await prisma.refresh_token.update({
    where: { id: verifyTokenDBExist.id },
    data: {
      is_active: false,
      revoked_at: new Date(),
    },
  });

  return true;
};
