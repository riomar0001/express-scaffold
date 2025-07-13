import "@/configs/dotenv.config";

interface JwtConfig {
  access: {
    secret: string;
    expiresIn: string;
  };
  refresh: {
    secret: string;
    expiresIn: string;
  };
}

export const jwtConfig: JwtConfig = {
  access: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: (process.env.JWT_ACCESS_TOKEN_TTL || "15m") as string,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: (process.env.JWT_REFRESH_TOKEN_TTL || "7d") as string,
  },
};