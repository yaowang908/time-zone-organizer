import { useCallback, useEffect } from 'react';

export const useDebouncedEffect = (effect: () => any, delay: number, deps: []) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}