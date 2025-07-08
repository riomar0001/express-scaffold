import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const saltRound = 10;
  return await bcrypt.hash(password, saltRound);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
