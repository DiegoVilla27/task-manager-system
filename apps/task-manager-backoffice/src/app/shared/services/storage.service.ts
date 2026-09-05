import { inject, Injectable } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

/**
 * Strict typing options representing permissible storage keys.
 * Guards against spelling inaccuracies or inconsistent keys in local state lookups.
 */
export type StorageKey = 'access_token' | 'refresh_token' | 'me';

/**
 * Static client-side utility wrapper for local storage transactions.
 * Automates data serialization, parsing, error handling, and type assertions.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly toastSvc = inject(ToastService);

  /**
   * Persists data under the specified key in browser localStorage.
   * Auto-serializes objects, arrays, and primitives.
   *
   * @typeParam T - Type of the data payload being stored.
   * @param key - The designated storage key identifier.
   * @param value - The data payload to stringify and store.
   *
   * @example
   * ```ts
   * StorageService.set('access_token', 'eyJhbGciOiJKV1Qi...');
   * StorageService.set('me', { id: '123', name: 'John' });
   * ```
   */
  set<T>(key: StorageKey, value: T): void {
    try {
      const serializedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      this.toastSvc.error(
        `❌ Error serializando/guardando la llave [${key}] en LocalStorage: ${error}`,
      );
    }
  }

  /**
   * Retrieves, parses, and types a record from local storage.
   *
   * @typeParam T - The expected output type.
   * @param key - The designated storage key identifier.
   * @returns The parsed instance of type T, the plain string value, or null if key does not exist or fails parsing.
   *
   * @example
   * ```ts
   * const token = StorageService.get<string>('access_token');
   * const user = StorageService.get<User>('me');
   * ```
   */
  get<T>(key: StorageKey): T | null {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      // Intentamos parsear por si es un objeto/array JSON o un booleano/número serializado
      // Si falla, significa que era un string plano válido.
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      this.toastSvc.error(
        `❌ Error leyendo/parseando la llave [${key}] desde LocalStorage: ${error}`,
      );
      return null;
    }
  }

  /**
   * Deletes a record associated with the designated storage key from localStorage.
   *
   * @param key - The designated storage key identifier.
   *
   * @example
   * ```ts
   * StorageService.remove('access_token');
   * ```
   */
  remove(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  /**
   * Queries whether a specific storage key exists in localStorage.
   *
   * @param key - The designated storage key identifier.
   * @returns `true` if key exists in storage; `false` otherwise.
   *
   * @example
   * ```ts
   * const hasToken = StorageService.has('access_token');
   * ```
   */
  has(key: StorageKey): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Purges all keys from the origin's browser local storage.
   *
   * @example
   * ```ts
   * StorageService.clear();
   * ```
   */
  clear(): void {
    localStorage.clear();
  }
}
