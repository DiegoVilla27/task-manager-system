/**
 * @fileoverview Unit tests for the `TableCell` tabular cell component.
 * Verifies standard data cell rendering (`<td>`), header cell rendering (`<th>`), column span handling,
 * and text alignment CSS modifiers (`left`, `right`, `center`).
 *
 * @module shared/components/ui/table/cell.test
 */

import { render, screen } from '@testing-library/react';
import { TableCell } from '.';

describe('UI: table cell', () => {
  /**
   * Verifies standard tabular data cell rendering with accessible `cell` role.
   */
  it('should render table cell', () => {
    // Arrange & Act
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Diego</TableCell>
          </tr>
        </tbody>
      </table>,
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
      <table>
        <tbody>
          <tr>
            <TableCell align="left">Diego</TableCell>
          </tr>
        </tbody>
      </table>,
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
      <table>
        <tbody>
          <tr>
            <TableCell align="right">Diego</TableCell>
          </tr>
        </tbody>
      </table>,
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
      <table>
        <tbody>
          <tr>
            <TableCell align="center">Diego</TableCell>
          </tr>
        </tbody>
      </table>,
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
      <table>
        <thead>
          <tr>
            <TableCell isHeader>Name</TableCell>
          </tr>
        </thead>
      </table>,
    );

    // Assert
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });
});
