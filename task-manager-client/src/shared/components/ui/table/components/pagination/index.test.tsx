import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePagination } from ".";

describe('UI: pagination', () => {

  it('should render pagination', () => {
    // Arrange
    // Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={1}
        totalItems={0}
        itemsPerPage={10}
        onPageChange={() => { }}
      />
    );
    // Assert
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  it('should call onPageChange when next is clicked', async () => {
    // Arrange
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    // Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={2}
        totalItems={20}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );
    await user.click(screen.getByLabelText('Siguiente'));
    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous is clicked', async () => {
    // Arrange
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    // Act
    render(
      <TablePagination
        currentPage={2}
        totalPages={2}
        totalItems={20}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );
    await user.click(screen.getByLabelText('Anterior'));
    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange when a page number is clicked', async () => {
    // Arrange
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    // Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={2}
        totalItems={20}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );
    await user.click(screen.getByRole('button', { name: '2' }));
    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should render N buttons when total pages is N', async () => {
    // Arrange
    // Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={12}
        totalItems={120}
        itemsPerPage={10}
        onPageChange={() => { }}
      />
    );
    // Assert
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });
});
