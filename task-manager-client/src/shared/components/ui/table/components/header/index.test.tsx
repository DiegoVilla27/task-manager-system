import { render, screen } from "@testing-library/react";
import { TableHeader } from ".";

describe('UI: table header', () => {

  it('should render table header', () => {
    // Arrange
    // Act
    render(
      <TableHeader>
        Name
      </TableHeader>
    );
    // Assert
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
