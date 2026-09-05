/**
 * @fileoverview Unit tests for the `TableRow` table row wrapper component.
 * Verifies semantic `<tr>` row element rendering and accessible `row` role presence.
 *
 * @module shared/components/ui/table/row.test
 */

import { render, screen } from '@testing-library/react';
import { TableRow } from '.';

describe('UI: table row', () => {
  /**
   * Verifies that the table row component renders with the accessible `row` role.
   */
  it('should render table row', () => {
    // Arrange & Act
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>,
    );

    // Assert
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
