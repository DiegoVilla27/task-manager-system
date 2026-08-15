import { render, screen } from '@testing-library/react';
import AppRoutes from '.';
import useMe from '@shared/hooks/use-me';

vi.mock('@shared/hooks/use-me', () => ({
  default: vi.fn(),
}));

vi.mock('@core/router/config', () => ({
  default: { id: 'router-test' },
}));

vi.mock('react-router-dom', () => ({
  RouterProvider: vi.fn(({ router }) => (
    <div data-testid="router-provider" data-router-id={router.id}>
      Router Mounted
    </div>
  )),
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useMe hook on mount', () => {
    // Act
    render(<AppRoutes />);
    // Assert
    expect(useMe).toHaveBeenCalledTimes(1);
  });

  it('should render the router', () => {
    // Act
    render(<AppRoutes />);
    // Assert
    const provider = screen.getByTestId('router-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveTextContent('Router Mounted');
    expect(provider).toHaveAttribute('data-router-id', 'router-test');
  });
});
