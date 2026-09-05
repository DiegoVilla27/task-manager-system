import type { AuthResponse } from '@features/auth/interfaces/response';

const authResponse: AuthResponse = {
  access_token: 'fake_at_123',
  refresh_token: 'fake_rt_123',
  expires_in: 3600,
};

export { authResponse };
