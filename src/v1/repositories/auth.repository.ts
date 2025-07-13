import prisma from "@/configs/prisma.config";
import { Prisma } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const createUser = async (userData: Prisma.userCreateInput) => {
  const user = await prisma.user.create({
    data: userData,
  });

  return user;
};

export const updateUser = async (
  id: string,
  userData: Prisma.userUpdateInput
) => {
  const user = await prisma.user.update({
    where: { id },
    data: userData,
  });

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id },
  });

  return user;
};

export const updatePassword = async (id: string, newHashedPassword: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { password: newHashedPassword },
  });

  return user;
};

export const verifyRefreshToken = async (tokenID: string) => {
  const refreshToken = await prisma.refresh_token.findUnique({
    where: { id: tokenID },
  });
  return refreshToken;
};

export const revokeRefreshToken = async (tokenID: string) => {
  const updatedToken = await prisma.refresh_token.update({
    where: { id: tokenID },
    data: {
      is_active: false,
      revoked_at: new Date(),
    },
  });

  return updatedToken;
};
