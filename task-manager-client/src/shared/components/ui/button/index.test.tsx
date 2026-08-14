import { render, screen } from "@testing-library/react";
import { Button } from ".";

describe('UI: button', () => {

  it('should render button with text', () => {
    // Arrange
    const text: string = 'Button Diego';
    // Act
    render(<Button>{text}</Button>);
    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should render button with icon', () => {
    // Arrange
    const text: string = 'Button Diego';
    const icon: React.ReactNode = <svg data-testid="icon" />;
    // Act
    render(<Button rightIcon={icon}>{text}</Button>);
    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render button with loading', () => {
    // Arrange
    const text: string = 'Button Diego';
    // Act
    render(<Button isLoading>{text}</Button>);
    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should render button full width', () => {
    // Arrange
    const text: string = 'Button Diego';
    // Act
    render(<Button fullWidth>{text}</Button>);
    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(text)).toHaveClass('w-full');
  });
});