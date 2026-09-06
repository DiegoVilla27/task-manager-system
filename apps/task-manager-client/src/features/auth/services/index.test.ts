import { httpService } from '@core/http';
import { loginSvc, logoutSvc, registerSvc } from '.';
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  UserMeResponse,
} from '@task-manager-system/api-types';

vi.mock('@core/http', () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const userRes: UserMeResponse = {
  id: '1',
  name: 'Diego',
  lastname: 'Villa',
  email: 'dv@gmail.com',
};
const authRes: AuthResponse = {
  access_token: 'token_123',
  refresh_token: 'refresh_123',
  expires_in: 3600,
};

describe('Auth: Services', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should login to user successfully', async () => {
    // Arrange
    const payload: AuthLoginRequest = {
      email: 'dv@gmail.com',
      password: '12345678',
    };
    vi.mocked(httpService.post).mockReturnValue(Promise.resolve(authRes));
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(userRes));
    // Act
    const res = await loginSvc(payload);
    // Assert
    expect(res).toEqual(authRes);
    expect(httpService.post).toHaveBeenCalledTimes(1);
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('TOKEN')).toEqual(authRes.access_token);
    expect(localStorage.getItem('REFRESH')).toEqual(authRes.refresh_token);
  });

  it('should register to user successfully', async () => {
    // Arrange
    const payload: AuthRegisterRequest = {
      name: 'Diego',
      lastname: 'Villa',
      email: 'dv@gmail.com',
      password: '12345678',
    };
    vi.mocked(httpService.post).mockReturnValue(Promise.resolve(authRes));
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(userRes));
    // Act
    const res = await registerSvc(payload);
    // Assert
    expect(res).toEqual(authRes);
    expect(httpService.post).toHaveBeenCalledTimes(1);
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('TOKEN')).toEqual(authRes.access_token);
    expect(localStorage.getItem('REFRESH')).toEqual(authRes.refresh_token);
  });

  it('should logout successfully', () => {
    // Act
    logoutSvc();
    // Assert
    expect(localStorage.getItem('TOKEN')).toBeNull();
    expect(localStorage.getItem('REFESH')).toBeNull();
    expect(localStorage.getItem('ME')).toBeNull();
  });
});
