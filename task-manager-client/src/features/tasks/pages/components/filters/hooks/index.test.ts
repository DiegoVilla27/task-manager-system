import { act, renderHook, waitFor } from '@testing-library/react';
import useFiltersTasks from '.';

describe('Tasks: useFiltersTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with provided search value', () => {
    // Arrange
    const search = 'Initial Search';
    const setSearch = vi.fn();

    // Act
    const { result } = renderHook(() => useFiltersTasks({ search, setSearch }));

    // Assert
    expect(result.current.inputValue).toBe('Initial Search');
  });

  it('should debounce and call setSearch when inputValue changes', async () => {
    // Arrange
    const setSearch = vi.fn();
    const { result } = renderHook(() => useFiltersTasks({ search: '', setSearch }));

    // Act
    act(() => {
      result.current.setInputValue('New Query');
    });

    // Assert
    await waitFor(
      () => {
        expect(setSearch).toHaveBeenLastCalledWith('New Query');
      },
      { timeout: 1000 },
    );
  });

  it('should update inputValue when search prop changes from parent', () => {
    // Arrange
    const setSearch = vi.fn();
    let search = 'Query 1';
    const { result, rerender } = renderHook(
      (props: { search: string }) => useFiltersTasks({ search: props.search, setSearch }),
      { initialProps: { search } },
    );

    expect(result.current.inputValue).toBe('Query 1');

    // Act
    search = 'Query 2';
    rerender({ search });

    // Assert
    expect(result.current.inputValue).toBe('Query 2');
  });

  it('should clear inputValue and prevent default/stop propagation on handleClearSearch', () => {
    // Arrange
    const setSearch = vi.fn();
    const { result } = renderHook(() => useFiltersTasks({ search: 'To Clear', setSearch }));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    // Act
    act(() => {
      result.current.handleClearSearch(mockEvent);
    });

    // Assert
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(result.current.inputValue).toBe('');
  });
});
