import { render, screen } from "@testing-library/react";
import { Table } from ".";

describe('UI: table', () => {

  it('should render table', () => {
    // Arrange
    // Act
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
