/**
 * @fileoverview Unit tests for the `useDebounce` custom React hook.
 * Verifies asynchronous timer advancement, value stabilization, and delayed state synchronization.
 *
 * @module shared/hooks/use-debounce.test
 */

import { act, renderHook } from "@testing-library/react";
import { useDebounce } from ".";

describe('useDebounce', () => {
  beforeEach(() => {
    // Enable fake timers before each test for deterministic time simulation
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers upon test completion
    vi.useRealTimers();
  });

  /**
   * Tests that the hook immediately initializes with the provided initial value.
   */
  it('should return a value after the delay time', () => {
    // Arrange
    const search: string = 'diego';
    const delay: number = 400;

    // Act
    const { result } = renderHook(() => useDebounce(search, delay));

    // Assert
    expect(result.current).toBe(search);
  });

  /**
   * Tests that rapid prop updates do not trigger intermediate state changes until
   * the specified millisecond delay has completely elapsed.
   */
  it('should not update the value before the delay time', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'diego', delay: 400 } }
    );

    // Act: Rerender with a new input value
    rerender({ value: 'diego villa', delay: 400 });

    // Advance time by 300ms (less than the 400ms debounce threshold)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Assert: Value should remain unchanged
    expect(result.current).toBe('diego');

    // Act: Advance remaining 100ms to cross the 400ms threshold
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Assert: Debounced value updates to the latest string
    expect(result.current).toBe('diego villa');
  });
});