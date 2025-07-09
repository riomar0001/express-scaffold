import prisma from "@/configs/prisma.config";
import { hashPassword } from "@/utils/passwordHashing";

export const updatePassService = async (
  user_id: string,
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { id: user_id },
    data: { password: hashedPassword },
  });

  return true;
};
