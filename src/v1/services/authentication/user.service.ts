import prisma from "@configs/prisma.config";
import { NotFoundError } from "@/utils/customErrors";

export const userService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
