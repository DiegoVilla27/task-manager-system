/**
 * @fileoverview Unit tests for the `TableCell` tabular cell component.
 * Verifies standard data cell rendering (`<td>`), header cell rendering (`<th>`), column span handling,
 * and text alignment CSS modifiers (`left`, `right`, `center`).
 *
 * @module shared/components/ui/table/cell.test
 */

import { render, screen } from "@testing-library/react";
import { TableCell } from ".";

describe('UI: table cell', () => {
  /**
   * Verifies standard tabular data cell rendering with accessible `cell` role.
   */
  it('should render table cell', () => {
    // Arrange & Act
    render(
      <TableCell>
        Diego
      </TableCell>
    );

    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toBeInTheDocument();
  });

  /**
   * Verifies left text alignment class application (`text-left`).
   */
  it('should render table cell with text left', () => {
    // Arrange & Act
    render(
      <TableCell align="left">
        Diego
      </TableCell>
    );

    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-left');
  });

  /**
   * Verifies right text alignment class application (`text-right`).
   */
  it('should render table cell with text right', () => {
    // Arrange & Act
    render(
      <TableCell align="right">
        Diego
      </TableCell>
    );

    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-right');
  });

  /**
   * Verifies center text alignment class application (`text-center`).
   */
  it('should render table cell with colSpan', () => {
    // Arrange & Act
    render(
      <TableCell align="center">
        Diego
      </TableCell>
    );

    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-center');
  });

  /**
   * Verifies that activating the `isHeader` flag renders a `<th>` element with the `columnheader` accessibility role.
   */
  it('should render table cell header', () => {
    // Arrange & Act
    render(
      <TableCell isHeader>
        Name
      </TableCell>
    );

    // Assert
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });
});
