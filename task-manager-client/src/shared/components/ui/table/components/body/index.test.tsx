import { render, screen } from "@testing-library/react";
import { TableBody } from ".";

describe('UI: table body', () => {

  it('should render table body', () => {
    // Arrange
    // Act
    render(
      <TableBody>
        Body
      </TableBody>
    );
    // Assert
    expect(screen.getByRole('rowgroup')).toBeInTheDocument();
  });
});
