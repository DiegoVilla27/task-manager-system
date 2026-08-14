/**
 * @fileoverview Unit tests for the `Avatar` UI component.
 * Verifies image rendering with accessibility alt text and fallback initial generation from user names.
 *
 * @module shared/components/ui/avatar.test
 */

import { render, screen } from '@testing-library/react';
import { Avatar } from ".";

describe('UI: avatar', () => {
  /**
   * Verifies that providing an image `src` renders an `<img>` element with the correct `alt` attribute.
   */
  it('should render with src', () => {
    // Arrange
    const name: string = 'John Doe';
    const src: string = 'https://example.com/image.png';

    // Act
    render(<Avatar name={name} src={src} />);

    // Assert
    expect(screen.getByAltText(name)).toBeInTheDocument();
  });

  /**
   * Verifies that when no image `src` is provided, the component generates and renders
   * initials derived from the full name string.
   */
  it('should render initials', () => {
    // Arrange
    const name: string = 'John Doe';

    // Act
    render(<Avatar name={name} />);

    // Assert
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});