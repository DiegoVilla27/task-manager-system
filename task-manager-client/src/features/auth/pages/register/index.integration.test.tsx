import StorageService from '@shared/utils/storage';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '.';
import { authResponse } from '@shared/mocks/data/auth';
import { meResponse } from '@shared/mocks/data/user';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const current = await vi.importActual('react-router-dom');
  return {
    ...current,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth: Register Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    StorageService.clear();
  });

  it('should register user successfully', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RegisterPage />, { wrapper: MemoryRouter });

    // Assert
    expect(StorageService.get('TOKEN')).toBeNull();
    expect(StorageService.get('REFRESH')).toBeNull();
    expect(StorageService.get('ME')).toBeNull();

    // Act
    const nameInput = screen.getByLabelText(/nombre/i);
    const lastnameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    const submit = screen.getByRole('button', { name: /registrarse/i });

    await user.type(nameInput, 'Diego');
    await user.type(lastnameInput, 'Villa');
    await user.type(emailInput, 'dv270992@gmail.com');
    await user.type(passwordInput, '12345678');
    await user.type(confirmPasswordInput, '12345678');
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
