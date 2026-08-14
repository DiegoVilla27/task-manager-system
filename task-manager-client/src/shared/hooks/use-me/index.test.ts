import StorageService from "@shared/utils/storage";
import { renderHook, waitFor } from "@testing-library/react";
import useMe from ".";
import { getMeSvc } from "@features/users/service";

vi.mock('@features/users/service', () => ({
  getMeSvc: vi.fn()
}));

describe('useMe', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch the user data if the token is present', async () => {
    // Arrange
    vi.spyOn(StorageService, 'get').mockReturnValue('token_123');
    // Act
    renderHook(() => useMe());
    // Assert
    expect(StorageService.get).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(getMeSvc).toHaveBeenCalledTimes(1);
    })
  });

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