import jwt from "jsonwebtoken";
import { hashPassword } from "@utils/passwordHashing";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/tokenGenerations";
import { verifyHashedRefreshToken } from "@utils/tokenHashing";
import { truncateIp } from "@utils/truncateIP";
import { verifyPassword } from "@utils/passwordHashing";
import {
  EmptyTokenError,
  NotFoundError,
  RegistrationError,
  AuthenticationError,
} from "@utils/customErrors";
import { RefreshTokenPayload } from "@/types/token";
import "@/configs/dotenv.config";
import {
  getUserByEmail,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  updatePassword,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../repositories/auth.repository";

interface PasswordUpdateResult {
  updatedAt: Date;
  userId: string;
}

interface RefreshTokenResult {
  accessToken: string;
  refreshToken?: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface RegistrationResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface FetchUserInfoResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

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

  const verifyTokenDBExist = await verifyRefreshToken(verifyToken.token_id);

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

  await revokeRefreshToken(verifyToken.token_id);
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

  const verifyTokenDBExist = await verifyRefreshToken(verifyToken.token_id);

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

  const user = await getUserById(verifyToken.user_id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const accessToken = generateAccessToken({
    user_id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
  };
};
