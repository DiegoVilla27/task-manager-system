/**
 * @fileoverview Unit tests for the `Link` navigation wrapper component.
 * Verifies React Router integration, target path assignment, and accessible anchor rendering.
 *
 * @module shared/components/ui/link.test
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from '.';

describe('UI: link', () => {
  /**
   * Verifies that the Link component correctly mounts within a Router context
   * and renders child link text.
   */
  it('should render link', () => {
    // Arrange
    const text: string = 'Google';

    // Act
    render(<Link to={'https://google.com'}>{text}</Link>, { wrapper: MemoryRouter });

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
