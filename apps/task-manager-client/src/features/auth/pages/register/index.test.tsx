import { render, screen } from '@testing-library/react';
import RegisterPage from '.';
import { MemoryRouter } from 'react-router-dom';
import useRegisterPage from './hooks';

vi.mock('@features/auth/pages/register/hooks', () => ({
  default: vi.fn(),
}));

describe('Auth: Register', () => {
  const renderComponent = () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRegisterPage).mockReturnValue({
      errors: {},
      register: vi.fn(),
      submit: vi.fn((e) => e?.preventDefault?.()),
    } as any);
  });

  it('should render register page', () => {
    // Act
    renderComponent();
    // Assert
    expect(screen.getByRole('heading', { level: 2, name: 'Crear una cuenta' }));
  });

  it('should render register page with data', () => {
    // Act
    renderComponent();
    // Assert
    expect(screen.getByRole('heading', { level: 2, name: 'Crear una cuenta' }));
    expect(
      screen.getByText('Completa tus datos para comenzar a gestionar tus tareas'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toBeInTheDocument();
  });

  it('should show error if name is invalid', () => {
    // Arrange
    vi.mocked(useRegisterPage).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn((e) => e.preventDefault()),
      errors: { name: { message: 'Name is required' } },
    } as any);
    // Act
    renderComponent();
    // Assert
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
});
