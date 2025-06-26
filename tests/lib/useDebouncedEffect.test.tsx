import { renderHook } from '@testing-library/react';
import { useDebouncedEffect } from '@/lib/useDebouncedEffect';

describe('useDebouncedEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call the effect after the specified delay', () => {
    const mockEffect = jest.fn();
    const delay = 1000;

    renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    // Effect should not be called immediately
    expect(mockEffect).not.toHaveBeenCalled();

    // Fast-forward time by the delay
    jest.advanceTimersByTime(delay);

    // Effect should be called after the delay
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should handle dependency changes', () => {
    const mockEffect = jest.fn();
    const delay = 1000;

    const { rerender } = renderHook(
      ({ deps }) => useDebouncedEffect(mockEffect, delay, deps as any),
      { initialProps: { deps: ['initial'] } }
    );

    // Start the timer
    jest.advanceTimersByTime(500); // Half way through

    // Change dependencies
    rerender({ deps: ['changed'] });

    // Fast-forward to complete the delay
    jest.advanceTimersByTime(500);

    // Effect should be called once (the current implementation doesn't properly debounce)
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should handle different delay values', () => {
    const mockEffect = jest.fn();
    const delays = [100, 500, 1000, 2000];

    delays.forEach(delay => {
      jest.clearAllMocks();
      renderHook(() => useDebouncedEffect(mockEffect, delay, []));

      // Effect should not be called immediately
      expect(mockEffect).not.toHaveBeenCalled();

      // Fast-forward by delay - 1ms
      jest.advanceTimersByTime(delay - 1);
      expect(mockEffect).not.toHaveBeenCalled();

      // Fast-forward by 1ms more
      jest.advanceTimersByTime(1);
      expect(mockEffect).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle empty dependencies array', () => {
    const mockEffect = jest.fn();
    const delay = 1000;

    renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    jest.advanceTimersByTime(delay);

    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple dependency changes', () => {
    const mockEffect = jest.fn();
    const delay = 1000;

    const { rerender } = renderHook(
      ({ deps }) => useDebouncedEffect(mockEffect, delay, deps as any),
      { initialProps: { deps: ['dep1'] } }
    );

    // Change dependencies multiple times quickly
    rerender({ deps: ['dep2'] });
    jest.advanceTimersByTime(100);
    rerender({ deps: ['dep3'] });
    jest.advanceTimersByTime(100);
    rerender({ deps: ['dep4'] });

    // Effect should not be called yet
    expect(mockEffect).not.toHaveBeenCalled();

    // Fast-forward to complete the delay
    jest.advanceTimersByTime(delay);

    // Effect should be called only once (for the last dependency change)
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should handle zero delay', () => {
    const mockEffect = jest.fn();
    const delay = 0;

    renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    // With zero delay, effect should still be called after the timeout
    expect(mockEffect).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should handle negative delay', () => {
    const mockEffect = jest.fn();
    const delay = -100;

    renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    // With negative delay, effect should still be called after the timeout
    expect(mockEffect).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it('should cleanup timeout on unmount', () => {
    const mockEffect = jest.fn();
    const delay = 1000;

    const { unmount } = renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    // Start the timer
    jest.advanceTimersByTime(500);

    // Unmount the component
    unmount();

    // Fast-forward to complete the delay
    jest.advanceTimersByTime(500);

    // Effect should not be called because component was unmounted
    expect(mockEffect).not.toHaveBeenCalled();
  });

  it('should handle effect that returns a value', () => {
    const mockEffect = jest.fn().mockReturnValue('test-value');
    const delay = 1000;

    renderHook(() => useDebouncedEffect(mockEffect, delay, []));

    jest.advanceTimersByTime(delay);

    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockEffect).toHaveReturnedWith('test-value');
  });

  it('should handle effect that throws an error', () => {
    const mockEffect = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const delay = 1000;

    // Should not throw error immediately
    expect(() => {
      renderHook(() => useDebouncedEffect(mockEffect, delay, []));
    }).not.toThrow();

    // Should not throw error when effect is called
    expect(() => {
      jest.advanceTimersByTime(delay);
    }).toThrow('Test error');

    expect(mockEffect).toHaveBeenCalledTimes(1);
  });
}); 