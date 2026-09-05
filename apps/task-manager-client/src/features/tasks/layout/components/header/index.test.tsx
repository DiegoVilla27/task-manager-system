import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '.';
import useHeader from './hooks';

vi.mock('@features/tasks/layout/components/header/hooks', () => ({
  default: vi.fn(),
}));

describe('Tasks: Header', () => {
  const renderComponent = () => {
    render(<Header />, { wrapper: MemoryRouter });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    // Arrange
    vi.mocked(useHeader).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });
    // Act
    renderComponent();
    // Assert
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Flow')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('should render component with user', () => {
    // Arrange
    const useHeaderRes = {
      user: {
        id: '123',
        name: 'Diego',
        lastname: 'Villa',
        email: 'dv@gmail.com',
      },
      logout: vi.fn(),
    };
    vi.mocked(useHeader).mockReturnValue(useHeaderRes);
    // Act
    renderComponent();
    // Assert
    expect(screen.getByText('Diego Villa')).toBeInTheDocument();
    expect(screen.getByText('dv@gmail.com')).toBeInTheDocument();
  });
});
