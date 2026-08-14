/**
 * @fileoverview Unit tests for the `Input` form control component.
 * Verifies textbox rendering, field labels, left and right auxiliary icons, error feedback, and helper captions.
 *
 * @module shared/components/ui/input.test
 */

import { render, screen } from "@testing-library/react";
import { Input } from ".";

describe('UI: input', () => {
  /**
   * Verifies standard input element rendering with accessible `textbox` role.
   */
  it('should render input', () => {
    // Arrange & Act
    render(<Input />);

    // Assert
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  /**
   * Verifies that the input renders an associated label text for form accessibility.
   */
  it('should render input with label', () => {
    // Arrange
    const label: string = 'Task Name';

    // Act
    render(<Input label={label} />);

    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  /**
   * Verifies insertion of left-aligned decorators such as search or user icons.
   */
  it('should render input with left icon', () => {
    // Arrange
    const icon: React.ReactNode = <svg data-testid="icon" />;

    // Act
    render(<Input leftIcon={icon} />);

    // Assert
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  /**
   * Verifies insertion of right-aligned decorators such as password visibility toggles or status icons.
   */
  it('should render input with right icon', () => {
    // Arrange
    const icon: React.ReactNode = <svg data-testid="icon" />;

    // Act
    render(<Input rightIcon={icon} />);

    // Assert
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  /**
   * Verifies that validation error messages are displayed below the input.
   */
  it('should render input with error', () => {
    // Arrange
    const error: string = 'Error message';

    // Act
    render(<Input error={error} />);

    // Assert
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  /**
   * Verifies informative helper text rendering beneath the input field.
   */
  it('should render input with helper text', () => {
    // Arrange
    const helperText: string = 'Helper text';

    // Act
    render(<Input helperText={helperText} />);

    // Assert
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });
});
