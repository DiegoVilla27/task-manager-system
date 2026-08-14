/**
 * @fileoverview Unit tests for the root `Table` container component.
 * Verifies table element creation, semantic child integration (`thead`, `tbody`, `tr`, `th`, `td`),
 * and table role accessibility mappings.
 *
 * @module shared/components/ui/table/table.test
 */

import { render, screen } from "@testing-library/react";
import { Table } from ".";

describe('UI: table', () => {
  /**
   * Verifies complete table tree mounting with associated table, columnheader, and cell accessibility roles.
   */
  it('should render table', () => {
    // Arrange & Act
    render(
      <Table>
        <thead>
          <tr>
            <th>
              Nombre
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Diego
            </td>
          </tr>
        </tbody>
      </Table>
    );

    // Assert
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Diego' })).toBeInTheDocument();
  });
});
