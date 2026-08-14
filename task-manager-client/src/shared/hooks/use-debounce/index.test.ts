import { act, renderHook } from "@testing-library/react";
import { useDebounce } from ".";

describe('useDebounce', () => {

  beforeEach(() => {
    // 1. Activamos los temporizadores falsos antes de cada test
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 2. Restauramos los temporizadores reales al terminar
    vi.useRealTimers();
  });

  it('should return a value after the delay time', () => {
    // Arrange
    const search: string = 'diego';
    const delay: number = 400;

    // Act
    const { result } = renderHook(() => useDebounce(search, delay));
    // Assert
    expect(result.current).toBe(search);
  });

  it('should not update the value before the delay time', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'diego', delay: 400 } }
    );
    // Act
    rerender({ value: 'diego villa', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Assert
    expect(result.current).toBe('diego');
    // Act
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Assert
    expect(result.current).toBe('diego villa');
  });
});