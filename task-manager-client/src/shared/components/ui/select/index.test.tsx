/**
 * @fileoverview Unit tests for the `Select` dropdown component.
 * Verifies combobox role rendering, label associations, validation error displays, and option element populations.
 *
 * @module shared/components/ui/select.test
 */

import { render, screen } from '@testing-library/react';
import { Select, type SelectOption } from '.';

describe('UI: select', () => {
  /**
   * Verifies standard select element rendering with accessible `combobox` role.
   */
  it('should render select', () => {
    // Arrange & Act
    render(<Select options={[]} />);

    // Assert
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  /**
   * Verifies that the select component renders with an associated accessible label.
   */
  it('should render select with label', () => {
    // Arrange & Act
    render(<Select label="test" options={[]} />);

    // Assert
    expect(screen.getByLabelText('test')).toBeInTheDocument();
  });

  /**
   * Verifies validation error messaging displayed under the select field.
   */
  it('should render select with error', () => {
    // Arrange & Act
    render(<Select error="test error" options={[]} />);

    // Assert
    expect(screen.getByText('test error')).toBeInTheDocument();
  });

  /**
   * Verifies that options passed in the `options` prop are mapped to `<option>` child elements.
   */
  it('should render select with options', () => {
    // Arrange
    const options: SelectOption[] = [
      {
        value: 'test',
        label: 'test',
      },
      {
        value: 'test2',
        label: 'test2',
      },
    ];

    // Act
    render(<Select options={options} />);

    // Assert
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
});
