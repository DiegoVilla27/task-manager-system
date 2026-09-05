import { useEffect, useState } from 'react';

/**
 * Hook personalizado para aplicar debounce a un valor.
 *
 * @param value Valor a aplicar debounce.
 * @param delay Tiempo de espera en milisegundos (por defecto 400ms).
 * @returns El valor tras haber transcurrido el tiempo especificado.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
