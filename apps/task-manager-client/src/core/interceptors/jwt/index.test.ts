import axiosInstance from '@core/axios';
import { logoutSvc } from '@features/auth/services';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import interceptorJwtAuth from '.';

vi.mock('@core/axios', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  },
}));

vi.mock('@features/auth/services', () => ({
  logoutSvc: vi.fn(),
}));

describe('interceptorJwtAuth', () => {
  let onFulfilledReq: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  let onFulfilledRes: (response: AxiosResponse) => AxiosResponse;
  let onRejectedRes: (error: AxiosError) => Promise<never>;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Ejecutamos el registro del interceptor
    interceptorJwtAuth();
    // Capturamos las funciones registradas en request use(onFulfilled, onRejected)
    const useCallReq = vi.mocked(axiosInstance.interceptors.request.use).mock.calls[0];
    onFulfilledReq = useCallReq[0] as typeof onFulfilledReq;
    // Capturamos las funciones registradas en response use(onFulfilled, onRejected)
    const useCallRes = vi.mocked(axiosInstance.interceptors.response.use).mock.calls[0];
    onFulfilledRes = useCallRes[0] as typeof onFulfilledRes;
    onRejectedRes = useCallRes[1] as typeof onRejectedRes;
  });

  it('should add authorization header when token exists', () => {
    // Arrange
    localStorage.setItem('TOKEN', 'token_123');
    const options = { headers: {} } as InternalAxiosRequestConfig;
    const result = onFulfilledReq(options);

    // Assert
    expect(result.headers.Authorization).toBe('Bearer token_123');
  });

  it('should not add authorization header when token does not exist', () => {
    // Arrange
    const options = { headers: {} } as InternalAxiosRequestConfig;
    const result = onFulfilledReq(options);

    // Assert
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should reject request with throw error on request rejection', async () => {
    // Arrange
    const [_, rejectedReq] = vi.mocked(axiosInstance.interceptors.request.use).mock.calls[0];
    const fakeError = new Error('Fake error');
    // Assert
    if (rejectedReq) {
      await expect(rejectedReq(fakeError)).rejects.toThrow(fakeError);
    }
  });

  it('should return response as is on response fulfillment', () => {
    // Arrange
    const mockResponse = { data: { success: true }, status: 200 } as AxiosResponse;
    // Act
    const result = onFulfilledRes(mockResponse);
    // Assert
    expect(result).toBe(mockResponse);
  });

  it('should redirect to login and call logoutSvc when response returns 401 error', async () => {
    // Arrange
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, href: '' },
    });

    const error = {
      response: {
        status: 401,
      },
    } as AxiosError;

    // Act
    const res = onRejectedRes(error);

    // Assert
    await expect(res).rejects.toEqual(error);
    expect(logoutSvc).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/auth/login');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, href: originalHref },
    });
  });

  it('should not redirect or logout when response error is not 401', async () => {
    // Arrange
    const error = {
      response: {
        status: 500,
      },
    } as AxiosError;

    // Act
    const res = onRejectedRes(error);

    // Assert
    await expect(res).rejects.toEqual(error);
    expect(logoutSvc).not.toHaveBeenCalled();
  });

  it('should handle error without response object', async () => {
    // Arrange
    const error = new Error('Network error') as AxiosError;

    // Act
    const res = onRejectedRes(error);

    // Assert
    await expect(res).rejects.toEqual(error);
    expect(logoutSvc).not.toHaveBeenCalled();
  });
});
