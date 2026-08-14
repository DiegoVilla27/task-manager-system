import { toast } from "sonner";
import StorageService from ".";

// Mockeamos el módulo sonner para interceptar y espiar llamadas a toast.error
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks(); // Limpia los llamados anteriores a los mocks
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shoul get data from local storage', () => {
    // Arrange
    const token: string = 'token_123';
    localStorage.setItem('TOKEN', token);
    // Act
    const res = StorageService.get('TOKEN');
    // Assert
    expect(res).toEqual(token);
  });

  it('should return null if key does not exist in local storage', () => {
    // Arrange
    const token: string = 'token_123';
    // Act
    const res = StorageService.get('TOKEN');
    // Assert
    expect(res).toEqual(null);
    expect(res).not.toEqual(token);
  });

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

  it('should save string in local storage', () => {
    // Arrange
    const token: string = 'token_123';
    // Act
    StorageService.set('TOKEN', token);
    // Assert
    expect(localStorage.getItem('TOKEN')).toEqual(token);
  });

  it('should save object in local storage', () => {
    // Arrange
    const user = { id: 1, name: 'Diego', email: 'dv@gmail.com' };
    // Act
    StorageService.set('ME', user);
    // Assert
    expect(localStorage.getItem('ME')).toEqual(JSON.stringify(user));
  });

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

  it('should remove data by key from local storage', () => {
    // Arrange
    const token: string = 'token_123';
    localStorage.setItem('TOKEN', token);
    // Act
    StorageService.remove('TOKEN');
    // Assert
    expect(localStorage.getItem('TOKEN')).toEqual(null);
  });

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