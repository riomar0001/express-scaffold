export interface PasswordUpdateResult {
  updatedAt: Date;
  userId: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
export interface RegistrationResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface FetchUserInfoResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}
