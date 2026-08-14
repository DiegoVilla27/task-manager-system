import { render, screen } from "@testing-library/react";
import { Input } from ".";

describe('UI: input', () => {

  it('should render input', () => {
    // Arrange
    // Act
    render(<Input />);
    // Assert
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render input with label', () => {
    // Arrange
    const label: string = 'Task Name';
    // Act
    render(<Input label={label} />);
    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should render input with left icon', () => {
    // Arrange
    const icon: React.ReactNode = <svg data-testid="icon" />;
    // Act
    render(<Input leftIcon={icon} />);
    // Assert
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render input with right icon', () => {
    // Arrange
    const icon: React.ReactNode = <svg data-testid="icon" />;
    // Act
    render(<Input rightIcon={icon} />);
    // Assert
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render input with error', () => {
    // Arrange
    const error: string = 'Error message';
    // Act
    render(<Input error={error} />);
    // Assert
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should render input with helper text', () => {
    // Arrange
    const helperText: string = 'Helper text';
    // Act
    render(<Input helperText={helperText} />);
    // Assert
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });
});
