/**
 * @fileoverview Unit tests for the `TableBody` table body container component.
 * Verifies semantic `<tbody>` element rendering and `rowgroup` accessibility role compliance.
 *
 * @module shared/components/ui/table/body.test
 */

import { render, screen } from "@testing-library/react";
import { TableBody } from ".";

describe('UI: table body', () => {
  /**
   * Verifies that the table body component mounts with the accessible `rowgroup` role.
   */
  it('should render table body', () => {
    // Arrange & Act
    render(
      <TableBody>
        Body
      </TableBody>
    );

    // Assert
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
  });
});
