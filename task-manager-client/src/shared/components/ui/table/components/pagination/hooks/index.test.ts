import { renderHook } from '@testing-library/react';
import usePagination from '.';

describe('UI: usePagination hook', () => {
  it('should handle empty items state (totalItems === 0)', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      }),
    );

    expect(result.current.startItem).toBe(0);
    expect(result.current.endItem).toBe(0);
    expect(result.current.visiblePages).toEqual([]);
    expect(result.current.isFirstPage).toBe(true);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should return all pages when totalPages is 5 or fewer', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 2,
        totalPages: 4,
        totalItems: 40,
        itemsPerPage: 10,
      }),
    );

    expect(result.current.startItem).toBe(11);
    expect(result.current.endItem).toBe(20);
    expect(result.current.visiblePages).toEqual([1, 2, 3, 4]);
    expect(result.current.isFirstPage).toBe(false);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should clamp visible pages to first 5 when currentPage is near beginning in a large page set', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 2, // start = 2 - 2 = 0 (< 1) -> start = 1, end = 5
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      }),
    );

    expect(result.current.visiblePages).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.isFirstPage).toBe(false);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should clamp visible pages to last 5 when currentPage is near end in a large page set', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 10, // end = 10 + 2 = 12 (> 10) -> end = 10, start = 10 - 4 = 6
        totalPages: 10,
        totalItems: 98,
        itemsPerPage: 10,
      }),
    );

    expect(result.current.startItem).toBe(91);
    expect(result.current.endItem).toBe(98);
    expect(result.current.visiblePages).toEqual([6, 7, 8, 9, 10]);
    expect(result.current.isFirstPage).toBe(false);
    expect(result.current.isLastPage).toBe(true);
  });

  it('should center visible pages when currentPage is in the middle in a large page set', () => {
    const { result } = renderHook(() =>
      usePagination({
        currentPage: 5, // start = 3, end = 7
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
      }),
    );

    expect(result.current.startItem).toBe(41);
    expect(result.current.endItem).toBe(50);
    expect(result.current.visiblePages).toEqual([3, 4, 5, 6, 7]);
    expect(result.current.isFirstPage).toBe(false);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should correctly identify first and last page boundaries', () => {
    const { result: firstPageResult } = renderHook(() =>
      usePagination({
        currentPage: 1,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 10,
      }),
    );

    expect(firstPageResult.current.isFirstPage).toBe(true);
    expect(firstPageResult.current.isLastPage).toBe(false);

    const { result: lastPageResult } = renderHook(() =>
      usePagination({
        currentPage: 5,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 10,
      }),
    );

    expect(lastPageResult.current.isFirstPage).toBe(false);
    expect(lastPageResult.current.isLastPage).toBe(true);
  });
});
