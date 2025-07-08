import bcrypt from "bcryptjs";

export const hashRefreshToken = async (refreshToken: string) => {
  const saltRound = 10;
  return await bcrypt.hash(refreshToken, saltRound);
};

export const verifyHashedRefreshToken = async (
  refreshToken: string,
  hashedRefreshToken: string
) => {
  return await bcrypt.compare(refreshToken, hashedRefreshToken);
};
