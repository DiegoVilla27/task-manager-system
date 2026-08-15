import axiosInstance from '@core/axios';
import { httpService } from '.';
import { cleanParams } from '@shared/utils/clean-params';

// 1. Mockeamos axiosInstance
vi.mock('@core/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// 2. Mockeamos cleanParams para verificar que se llame
vi.mock('@shared/utils/clean-params', () => ({
  cleanParams: vi.fn((params) => params), // Retorna los params tal cual para validar la llamada
}));

describe('httpService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform GET request, clean params and return data', async () => {
    // Arrange
    const res = { data: { id: 1, name: 'test' } };
    vi.mocked(axiosInstance.get).mockResolvedValue(res);
    const params = { role: 'ADMIN', active: undefined };
    // Act
    const data = await httpService.get('/users', params);
    // Assert
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.get).toHaveBeenCalledWith('/users', { params });
    expect(cleanParams).toHaveBeenCalledTimes(1);
    expect(data).toEqual(res.data);
  });

  it('should perform POST request, clean params and return data', async () => {
    // Arrange
    const res = { data: { name: 'test', email: 'test@test.com' } };
    const payload = { name: 'test', email: 'test@test.com' };
    vi.mocked(axiosInstance.post).mockResolvedValue(res);
    // Act
    const data = await httpService.post('/users', payload);
    // Assert
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith('/users', payload, { params: undefined });
    expect(cleanParams).toHaveBeenCalledTimes(1);
    expect(data).toBe(res.data);
  });

  it('should perform PATCH request, clean params and return data', async () => {
    // Arrange
    const res = { data: { name: 'test', email: 'test@test.com' } };
    const payload = { email: 'test@test.com' };
    vi.mocked(axiosInstance.patch).mockResolvedValue(res);
    // Act
    const data = await httpService.patch('/users', payload);
    // Assert
    expect(axiosInstance.patch).toHaveBeenCalledTimes(1);
    expect(axiosInstance.patch).toHaveBeenCalledWith('/users', payload, { params: undefined });
    expect(cleanParams).toHaveBeenCalledTimes(1);
    expect(data).toBe(res.data);
  });

  it('should perform PUT request, clean params and return data', async () => {
    // Arrange
    const res = { data: { name: 'test', email: 'test@test.com' } };
    const payload = { name: 'test', email: 'test@test.com' };
    vi.mocked(axiosInstance.put).mockResolvedValue(res);
    // Act
    const data = await httpService.put('/users', payload);
    // Assert
    expect(axiosInstance.put).toHaveBeenCalledTimes(1);
    expect(axiosInstance.put).toHaveBeenCalledWith('/users', payload, { params: undefined });
    expect(cleanParams).toHaveBeenCalledTimes(1);
    expect(data).toBe(res.data);
  });

  it('should perform DELETE request, clean params and return data', async () => {
    // Arrange
    const res = { data: { name: 'test', email: 'test@test.com' } };
    vi.mocked(axiosInstance.delete).mockResolvedValue(res);
    // Act
    const data = await httpService.delete('/users/123');
    // Assert
    expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/users/123', { params: undefined });
    expect(cleanParams).toHaveBeenCalledTimes(1);
    expect(data).toBe(res.data);
  });
});
