import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '.';
import useLoginPage from './hooks';

vi.mock('@features/auth/pages/login/hooks', () => ({
  default: vi.fn(),
}));

describe('Auth: Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useLoginPage).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn((e) => e?.preventDefault?.()),
      errors: {},
    } as any);
  });

  const renderComponent = () => {
    return render(<LoginPage />, { wrapper: MemoryRouter });
  };

  it('should render the login page', () => {
    // Act
    renderComponent();
    // Assert
    expect(screen.getByRole('heading', { level: 2, name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(
      screen.getByText('Ingresa tus credenciales para acceder a tus tareas'),
    ).toBeInTheDocument();
  });

  it('shoulde render elements', () => {
    // Act
    renderComponent();
    // // Assert
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByText('¿No tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate aquí' })).toBeInTheDocument();
  });

  it('should render error message when email is invalid', () => {
    // Arrange
    vi.mocked(useLoginPage).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn((e) => e?.preventDefault?.()),
      errors: {
        email: { message: 'Correo electrónico inválido' },
      },
    } as any);
    // Act
    renderComponent();
    // Assert
    expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
  });
});
