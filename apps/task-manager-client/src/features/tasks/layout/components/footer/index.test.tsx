import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '.';

describe('Tasks: Footer', () => {
  it('should render component', () => {
    // Act
    render(<Footer />, { wrapper: MemoryRouter });
    // Assert
    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} TaskFlow System. Todos los derechos reservados.`,
      ),
    ).toBeInTheDocument();
  });
});
