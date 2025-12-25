import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "@utils/passwordHashing";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/tokenGenerations";
import { verifyHashedRefreshToken } from "@utils/tokenHashing";
import { truncateIp } from "@utils/truncateIP";
import {
  EmptyTokenError,
  NotFoundError,
  RegistrationError,
  AuthenticationError,
} from "@utils/customErrors";
import { RefreshTokenPayload } from "@/types/token";
import {
  FetchUserInfoResult,
  LoginResult,
  PasswordUpdateResult,
  RefreshTokenResult,
  RegistrationResult,
} from "@/types/auth";
import { env } from "@/configs/env.config";
import {
  getUserByEmail,
  createUser,
  getUserById,
  updatePassword,
  verifyRefreshToken as verifyRefreshTokenInDB,
  revokeRefreshToken,
} from "../repositories/auth.repository";

/**
 * Validates a refresh token and returns the decoded payload and DB record.
 * Throws appropriate errors if validation fails.
 */
const validateRefreshToken = async (
  refresh_token: string,
  ip_address: string,
  user_agent: string
) => {
  if (!refresh_token) {
    throw new EmptyTokenError("Refresh token is required");
  }

  const SECRET = env.JWT_REFRESH_TOKEN_SECRET;
  let decoded: RefreshTokenPayload;

  try {
    decoded = jwt.verify(refresh_token, SECRET) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new jwt.TokenExpiredError("Refresh token has expired", error.expiredAt);
    }
    throw new AuthenticationError("Invalid refresh token format");
  }

  const tokenRecord = await verifyRefreshTokenInDB(decoded.token_id);

  if (!tokenRecord) {
    throw new NotFoundError("Refresh token not found");
  }

  if (!tokenRecord.is_active) {
    throw new AuthenticationError("Refresh token has been revoked");
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    throw new jwt.TokenExpiredError("Refresh token has expired", tokenRecord.expires_at);
  }

  if (
    tokenRecord.ip_address !== truncateIp(ip_address) ||
    tokenRecord.user_agent !== user_agent
  ) {
    throw new AuthenticationError("Refresh token is not valid for this device");
  }

  const isValidHash = await verifyHashedRefreshToken(
    refresh_token,
    tokenRecord.token_hash
  );

  if (!isValidHash) {
    throw new AuthenticationError("Invalid refresh token");
  }

  return { decoded, tokenRecord };
};

export const registerUser = async (
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  role: string,
  ip_address: string,
  userAgent: string
): Promise<RegistrationResult> => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new RegistrationError("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    email,
    first_name,
    last_name,
    password: hashedPassword,
    role,
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

export const authenticateUser = async (
  email: string,
  password: string,
  ip_address: string,
  userAgent: string
): Promise<LoginResult> => {
  const user = await getUserByEmail(email);
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
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const deauthenticateUser = async (
  refresh_token: string,
  ip_address: string,
  user_agent: string
): Promise<void> => {
  const { decoded } = await validateRefreshToken(refresh_token, ip_address, user_agent);
  await revokeRefreshToken(decoded.token_id);
};

export const fetchUserInfo = async (
  userId: string
): Promise<FetchUserInfoResult> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
};

export const updateUserPassword = async (
  user_id: string,
  password: string,
  confirmPassword: string
): Promise<PasswordUpdateResult> => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await hashPassword(password);

  await updatePassword(user_id, hashedPassword);

  return {
    updatedAt: new Date(),
    userId: user_id,
  };
};

export const refreshToken = async (
  refresh_token: string,
  ip_address: string,
  user_agent: string
): Promise<RefreshTokenResult> => {
  const { decoded } = await validateRefreshToken(refresh_token, ip_address, user_agent);

  const user = await getUserById(decoded.user_id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const accessToken = generateAccessToken({
    user_id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
};
