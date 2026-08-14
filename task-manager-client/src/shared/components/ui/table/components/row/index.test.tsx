import { render, screen } from "@testing-library/react";
import { TableRow } from ".";

describe('UI: table row', () => {

  it('should render table row', () => {
    // Arrange
    // Act
    render(
      <TableRow>
        Row
      </TableRow>
    );
    // Assert
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
