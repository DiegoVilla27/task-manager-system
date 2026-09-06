import { httpService } from '@core/http';
import { getMeSvc } from '.';
import type { UserMeResponse } from '@task-manager-system/api-types';

vi.mock('@core/http', () => ({
  httpService: {
    get: vi.fn(),
  },
}));

describe('Users service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should get current user', async () => {
    // Arrange
    const user: UserMeResponse = {
      id: '1',
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
    };
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(user));
    // Act
    const result = await getMeSvc();
    // Assert
    expect(result).toEqual(user);
    expect(httpService.get).toHaveBeenCalledTimes(1);
  });

  it('should save user in local storage', async () => {
    // Arrange
    const user: UserMeResponse = {
      id: '1',
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
    };
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(user));
    // Act
    await getMeSvc();
    // Assert
    expect(localStorage.getItem('ME')).toEqual(JSON.stringify(user));
  });
});
