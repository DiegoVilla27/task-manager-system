import { authResponse } from '@shared/mocks/data/auth';
import { meResponse } from '@shared/mocks/data/user';
import StorageService from '@shared/utils/storage';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '.';

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
      expect(StorageService.get('TOKEN')).toEqual(authResponse.access_token);
      expect(StorageService.get('REFRESH')).toEqual(authResponse.refresh_token);
      expect(StorageService.get('ME')).toEqual(meResponse);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
