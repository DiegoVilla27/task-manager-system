import { render, screen } from '@testing-library/react';
import AuthLayout from '.';
import { MemoryRouter } from 'react-router-dom';

describe('Auth: Layout', () => {
  it('should render layout', () => {
    // Arrange
    // Act
    render(<AuthLayout />, { wrapper: MemoryRouter });
    // Assert
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Flow')).toBeInTheDocument();
  });
});
