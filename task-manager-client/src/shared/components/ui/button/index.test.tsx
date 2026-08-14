/**
 * @fileoverview Unit tests for the `Button` UI component.
 * Verifies standard text rendering, icon attachments, loading spinner state with accessible labeling, and full-width layout classes.
 *
 * @module shared/components/ui/button.test
 */

import { render, screen } from "@testing-library/react";
import { Button } from ".";

describe('UI: button', () => {
  /**
   * Verifies standard button creation with textual children.
   */
  it('should render button with text', () => {
    // Arrange
    const text: string = 'Button Diego';

    // Act
    render(<Button>{text}</Button>);

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  /**
   * Verifies right-aligned auxiliary icon insertion within the button layout.
   */
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

  /**
   * Verifies that activating the `isLoading` flag displays an accessible loading spinner indicator.
   */
  it('should render button with loading', () => {
    // Arrange
    const text: string = 'Button Diego';

    // Act
    render(<Button isLoading>{text}</Button>);

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  /**
   * Verifies that enabling `fullWidth` applies the `w-full` CSS class to stretch across the parent container.
   */
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