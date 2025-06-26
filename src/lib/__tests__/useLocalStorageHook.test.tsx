import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorageHook';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('should initialize with initial value when localStorage is empty', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    expect(result.current[0]).toBe('initial-value');
  });

  it('should initialize with value from localStorage when available', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update value and localStorage when setValue is called', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('should handle function updates', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('test-key', 5));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(6));
  });

  it('should handle complex objects', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const initialObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initialObject));

    act(() => {
      result.current[1]({ name: 'Jane', age: 25 });
    });

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ name: 'Jane', age: 25 }));
  });

  it('should handle arrays', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('numbers', initialArray));

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
    expect(localStorage.setItem).toHaveBeenCalledWith('numbers', JSON.stringify([4, 5, 6]));
  });

  it('should handle localStorage errors gracefully', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    (localStorage.setItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    act(() => {
      result.current[1]('new-value');
    });

    // Should not throw error, but should log it
    expect(console.log).toHaveBeenCalled();
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle localStorage.getItem errors gracefully', () => {
    (localStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    // Should fall back to initial value
    expect(result.current[0]).toBe('initial-value');
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle invalid JSON in localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

    // Should fall back to initial value when JSON.parse fails
    expect(result.current[0]).toBe('initial-value');
  });

  it('should maintain separate state for different keys', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value2');

    act(() => {
      result1.current[1]('new-value1');
    });

    expect(result1.current[0]).toBe('new-value1');
    expect(result2.current[0]).toBe('value2');
  });

  it('should handle null and undefined values', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage<string | null>('test-key', null));

    act(() => {
      result.current[1]((prev: string | null) => undefined as any);
    });

    expect(result.current[0]).toBeUndefined();
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(undefined));
  });

  it('should handle boolean values', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('test-key', false));

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(true));
  });

  it('should preserve data in localStorage when user refreshes the page', () => {
    // Simulate initial page load with no data in localStorage
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    // First instance of the hook (simulating first page load)
    const { result: firstInstance, unmount: unmountFirst } = renderHook(() =>
      useLocalStorage('user-data', { name: 'John', timezone: 'UTC' })
    );

    // Update the data (user adds/modifies data)
    act(() => {
      firstInstance.current[1]({ name: 'Jane', timezone: 'EST' });
    });

    expect(firstInstance.current[0]).toEqual({ name: 'Jane', timezone: 'EST' });
    expect(localStorage.setItem).toHaveBeenCalledWith('user-data', JSON.stringify({ name: 'Jane', timezone: 'EST' }));

    // Unmount the first instance (simulating page refresh)
    unmountFirst();

    // Simulate localStorage having the saved data after page refresh
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify({ name: 'Jane', timezone: 'EST' }));

    // Second instance of the hook (simulating page refresh)
    const { result: secondInstance } = renderHook(() =>
      useLocalStorage('user-data', { name: 'John', timezone: 'UTC' })
    );

    // Verify that the data is preserved from localStorage
    expect(secondInstance.current[0]).toEqual({ name: 'Jane', timezone: 'EST' });

    // Verify that the initial value is not used (data was loaded from localStorage)
    expect(secondInstance.current[0]).not.toEqual({ name: 'John', timezone: 'UTC' });
  });
}); 