interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export type { AuthResponse };