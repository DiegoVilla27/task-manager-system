/**
 * @fileoverview Unit tests for the `TableHeader` table header section component.
 * Verifies semantic `<thead>` container mounting and `rowgroup` / `row` role integration.
 *
 * @module shared/components/ui/table/header.test
 */

import { render, screen } from '@testing-library/react';
import { TableHeader } from '.';

describe('UI: table header', () => {
  /**
   * Verifies that the table header renders its underlying `<thead>` and header `<tr>` row.
   */
  it('should render table header', () => {
    // Arrange & Act
    render(
      <table>
        <TableHeader>
          <th>Name</th>
        </TableHeader>
      </table>,
    );

    // Assert
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
