/**
 * @fileoverview Unit tests for the `StorageService` local storage abstraction wrapper.
 * Verifies type-safe serialization, deserialization, exception handling, and toast alert dispatching.
 *
 * @module shared/utils/storage.test
 */

import { toast } from "sonner";
import StorageService from ".";

// Mock Sonner toast library to assert notification side-effects on exceptions
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Tests retrieval of stored raw primitive string values from LocalStorage.
   */
  it('shoul get data from local storage', () => {
    // Arrange
    const token: string = 'token_123';
    localStorage.setItem('TOKEN', token);

    // Act
    const res = StorageService.get('TOKEN');

    // Assert
    expect(res).toEqual(token);
  });

  /**
   * Tests that requesting a non-existent storage key returns `null` gracefully.
   */
  it('should return null if key does not exist in local storage', () => {
    // Arrange
    const token: string = 'token_123';

    // Act
    const res = StorageService.get('TOKEN');

    // Assert
    expect(res).toEqual(null);
    expect(res).not.toEqual(token);
  });

  /**
   * Tests exception resilience when `localStorage.getItem` throws a DOMException or SecurityError.
   * Asserts that a Sonner error toast is dispatched and `null` is returned safely.
   */
  it('should reject get data from local storage', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Error al obtener del almacenamiento local');
    });

    // Act
    const res = StorageService.get('TOKEN');

    // Assert
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Error al leer del almacenamiento local [TOKEN]");
    expect(res).toBeNull();
  });

  /**
   * Tests storing primitive strings directly into LocalStorage.
   */
  it('should save string in local storage', () => {
    // Arrange
    const token: string = 'token_123';

    // Act
    StorageService.set('TOKEN', token);

    // Assert
    expect(localStorage.getItem('TOKEN')).toEqual(token);
  });

  /**
   * Tests JSON serialization when persisting complex objects into LocalStorage.
   */
  it('should save object in local storage', () => {
    // Arrange
    const user = { id: 1, name: 'Diego', email: 'dv@gmail.com' };

    // Act
    StorageService.set('ME', user);

    // Assert
    expect(localStorage.getItem('ME')).toEqual(JSON.stringify(user));
  });

  /**
   * Tests exception handling when `localStorage.setItem` throws (e.g. QuotaExceededError).
   * Asserts that a notification toast is triggered to inform the user.
   */
  it('should reject save data in local storage', () => {
    // Arrange
    const token: string = 'token_123';
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Error al guardar en almacenamiento local');
    });

    // Act
    StorageService.set('TOKEN', token);

    // Assert
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Error al guardar en almacenamiento local [TOKEN]');
  });

  /**
   * Tests removing a single entry by key from LocalStorage.
   */
  it('should remove data by key from local storage', () => {
    // Arrange
    const token: string = 'token_123';
    localStorage.setItem('TOKEN', token);

    // Act
    StorageService.remove('TOKEN');

    // Assert
    expect(localStorage.getItem('TOKEN')).toEqual(null);
  });

  /**
   * Tests clearing all key-value entries from LocalStorage.
   */
  it('should remove all data in local storage', () => {
    // Arrange
    localStorage.setItem('TOKEN', 'token_123');
    localStorage.setItem('REFRESH', 'refresh_token_123');
    localStorage.setItem('ME', JSON.stringify({ id: 1, name: 'Diego', email: 'dv@gmail.com' }));

    // Act
    StorageService.clear();

    // Assert
    expect(localStorage.length).toEqual(0);
  });
});