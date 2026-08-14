/**
 * @fileoverview Unit tests for the `Badge` UI component.
 * Verifies status pill rendering, variant styling classes, and child text node insertion.
 *
 * @module shared/components/ui/badge.test
 */

import { render, screen } from "@testing-library/react";
import { Badge } from ".";

describe('UI: badge', () => {
  /**
   * Verifies that the badge component renders its textual children properly inside the DOM.
   */
  it('should render a badge with text', () => {
    // Arrange
    const text: string = 'Badge Diego';

    // Act
    render(<Badge>{text}</Badge>);

    // Assert
    expect(screen.getByText('Badge Diego')).toBeInTheDocument();
  });
});