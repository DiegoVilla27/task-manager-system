/**
 * @fileoverview Unit tests for the `TablePagination` navigation component.
 * Verifies page button generation, next/previous step callbacks, direct page click events, and multi-page pagination limits.
 *
 * @module shared/components/ui/table/pagination.test
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TablePagination } from '.';

describe('UI: pagination', () => {
  /**
   * Verifies that the pagination component renders page numbers when mounted.
   */
  it('should render pagination', () => {
    // Arrange & Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={1}
        totalItems={0}
        itemsPerPage={10}
        onPageChange={() => {}}
      />,
    );

    // Assert
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  /**
   * Verifies that clicking the 'Next' navigation button invokes `onPageChange` with the incremented page number.
   */
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
      />,
    );
    await user.click(screen.getByLabelText('Siguiente'));

    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  /**
   * Verifies that clicking the 'Previous' navigation button invokes `onPageChange` with the decremented page number.
   */
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
      />,
    );
    await user.click(screen.getByLabelText('Anterior'));

    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  /**
   * Verifies that clicking a specific numbered page button directly transitions to that page index.
   */
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
      />,
    );
    await user.click(screen.getByRole('button', { name: '2' }));

    // Assert
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  /**
   * Verifies that when total pages is large (e.g., 12), the pagination algorithm creates
   * a windowed set of buttons with navigation boundaries.
   */
  it('should render N buttons when total pages is N', async () => {
    // Arrange & Act
    render(
      <TablePagination
        currentPage={1}
        totalPages={12}
        totalItems={120}
        itemsPerPage={10}
        onPageChange={() => {}}
      />,
    );

    // Assert: Previous + Page 1..5 + Next = 7 total buttons in current window
    expect(screen.getAllByRole('button')).toHaveLength(7);
  });
});
