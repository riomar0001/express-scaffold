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
