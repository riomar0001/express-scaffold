type AccessTokenPayloadTypes = {
  user_id: string;
  email: string;
  role: string;
};

type RefreshTokenData = {
  token: string;
  token_id: string;
  expires_at: Date;
};

interface RefreshTokenPayload {
  token_id: string;
  user_id: string;
  iat?: number;
  exp?: number;
}
export interface AccessTokenPayload {
  user_id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}