import { render, screen } from "@testing-library/react";
import { TableCell } from ".";

describe('UI: table cell', () => {

  it('should render table cell', () => {
    // Arrange
    // Act
    render(
      <TableCell>
        Diego
      </TableCell>
    );
    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toBeInTheDocument();
  });

  it('should render table cell with text left', () => {
    // Arrange
    // Act
    render(
      <TableCell align="left">
        Diego
      </TableCell>
    );
    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-left');
  });

  it('should render table cell with text right', () => {
    // Arrange
    // Act
    render(
      <TableCell align="right">
        Diego
      </TableCell>
    );
    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-right');
  });

  it('should render table cell with colSpan', () => {
    // Arrange
    // Act
    render(
      <TableCell align="center">
        Diego
      </TableCell>
    );
    // Assert
    expect(screen.getByRole('cell', { name: 'Diego' })).toHaveClass('text-center');
  });

  it('should render table cell header', () => {
    // Arrange
    // Act
    render(
      <TableCell isHeader>
        Name
      </TableCell>
    );
    // Assert
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });
});
