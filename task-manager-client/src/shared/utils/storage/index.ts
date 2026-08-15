import { toast } from 'sonner';

const STORAGE_KEYS = {
  TOKEN: 'TOKEN',
  REFRESH: 'REFRESH',
  ME: 'ME',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

class StorageService {
  static get<T>(key: StorageKey): T | null {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch {
      toast.error(`Error al leer del almacenamiento local [${key}]`);
      return null;
    }
  }

  static set<T>(key: StorageKey, value: T): void {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch {
      toast.error(`Error al guardar en almacenamiento local [${key}]`);
    }
  }

  static remove(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

export default StorageService;
