import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '.';
import { httpService } from '@core/http';
import StorageService from '@shared/utils/storage';

vi.mock('@core/http', () => ({
  httpService: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const current = await vi.importActual('react-router-dom');
  return {
    ...current,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth: Login Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    StorageService.clear();
  });

  const renderComponent = () => {
    return render(<LoginPage />, { wrapper: MemoryRouter });
  };

  it('should login user successfully', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockAuthResponse = {
      access_token: 'fake_jwt_token',
      refresh_token: 'fake_refresh_token',
      expires_in: 3600,
    };
    const mockUserMe = {
      id: '1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'dv@gmail.com',
    };
    vi.mocked(httpService.post).mockResolvedValue(mockAuthResponse);
    vi.mocked(httpService.get).mockResolvedValue(mockUserMe);

    renderComponent();

    // Act
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submit = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'dv@gmail.com');
    await user.type(passwordInput, '12345678');
    await user.click(submit);

    // Assert
    await waitFor(() => {
      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith('/auth/login', {
        email: 'dv@gmail.com',
        password: '12345678',
      });

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith('/users/me');

      expect(StorageService.get('TOKEN')).toEqual(mockAuthResponse.access_token);
      expect(StorageService.get('REFRESH')).toEqual(mockAuthResponse.refresh_token);
      expect(StorageService.get('ME')).toEqual(mockUserMe);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
