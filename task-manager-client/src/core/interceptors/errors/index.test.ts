import axiosInstance from '@core/axios';
import interceptorErrors from '.';
import type { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

vi.mock('@core/axios', () => ({
  default: {
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('interceptorErrors', () => {
  let onFulfilled: (response: AxiosResponse) => AxiosResponse;
  let onRejected: (error: AxiosError) => Promise<never>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Ejecutamos el registro del interceptor
    interceptorErrors();
    // Capturamos las funciones registradas en use(onFulfilled, onRejected)
    const useCall = vi.mocked(axiosInstance.interceptors.response.use).mock.calls[0];
    onFulfilled = useCall[0] as typeof onFulfilled;
    onRejected = useCall[1] as typeof onRejected;
  });

  it('should register response interceptor on axiosInstance', () => {
    // Assert
    expect(axiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toBeTypeOf('function');
    expect(onRejected).toBeTypeOf('function');
  });

  it('should return response success', () => {
    // Arrange
    const success = { status: 200, data: { message: 'OK' } } as AxiosResponse;
    const result = onFulfilled(success);

    // Assert
    expect(result.status).toBe(200);
  });

  it('should return error with message', async () => {
    // Arrange
    const error = { response: { data: { message: 'Error message' }, status: 400 } } as AxiosError;
    const result = onRejected(error);
    // Assert
    await expect(result).rejects.toEqual(error);
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Error message', { duration: 10000 });
  });

  it('should return error with multiple errors', async () => {
    // Arrange
    const error = {
      response: {
        data: {
          message: 'Error message',
          errors: [
            {
              field: 'name',
              message: 'Name is required',
            },
            {
              field: 'email',
              message: 'Email is required',
            },
          ],
        },
        status: 404,
      },
    } as AxiosError;
    const result = onRejected(error);
    // Assert
    await expect(result).rejects.toEqual(error);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should return error global', async () => {
    // Arrange
    const error = { response: { data: {}, status: 500 } } as AxiosError;
    const result = onRejected(error);
    // Assert
    await expect(result).rejects.toEqual(error);
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor, reintenta.', {
      duration: 5000,
    });
  });
});
