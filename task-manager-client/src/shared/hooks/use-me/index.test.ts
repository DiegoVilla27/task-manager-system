/**
 * @fileoverview Unit tests for the `useMe` custom authentication profile hook.
 * Verifies automatic user profile fetching upon session detection and token presence checks.
 *
 * @module shared/hooks/use-me.test
 */

import StorageService from '@shared/utils/storage';
import { renderHook, waitFor } from '@testing-library/react';
import useMe from '.';
import { getMeSvc } from '@features/users/service';

// Mock user service endpoint function
vi.mock('@features/users/service', () => ({
  getMeSvc: vi.fn(),
}));

describe('useMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Tests that when an authentication JWT token is present in LocalStorage,
   * the hook invokes `getMeSvc` to fetch the active authenticated user profile.
   */
  it('should fetch the user data if the token is present', async () => {
    // Arrange
    vi.spyOn(StorageService, 'get').mockReturnValue('token_123');

    // Act
    renderHook(() => useMe());

    // Assert
    expect(StorageService.get).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(getMeSvc).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Tests that if no JWT token is stored, the hook aborts user profile retrieval
   * to avoid unnecessary unauthorized API roundtrips.
   */
  it('should not fetch the user data if the token is not present', async () => {
    // Arrange
    vi.spyOn(StorageService, 'get').mockReturnValue(null);

    // Act
    renderHook(() => useMe());

    // Assert
    expect(StorageService.get).toHaveBeenCalledTimes(1);
    expect(getMeSvc).not.toHaveBeenCalled();
  });
});
