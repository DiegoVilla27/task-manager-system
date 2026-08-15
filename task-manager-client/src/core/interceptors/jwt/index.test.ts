import axiosInstance from "@core/axios";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import interceptorJwtAuth from ".";

vi.mock('@core/axios', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn()
      },
      response: {
        use: vi.fn()
      }
    }
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
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
    const token = localStorage.setItem('TOKEN', 'token_123');
    const options = { headers: { 'Authorization': `Bearer ${token}` } } as InternalAxiosRequestConfig;
    const result = onFulfilledReq(options);

    // Assert
    expect(result.headers.Authorization).toBe('Bearer token_123');
  });

  it('should not add authorization header when token not exists', () => {
    // Arrange
    const options = {} as InternalAxiosRequestConfig;
    const result = onFulfilledReq(options);

    // Assert
    expect(result.headers?.Authorization).toBe(undefined);
  });

  it('should reject request with throw error', async () => {
    // Arrange
    const [_, rejectedReq] = vi.mocked(axiosInstance.interceptors.request.use).mock.calls[0];
    const fakeError = new Error('Fake error');
    // Assert
    await expect(rejectedReq).rejects.throw(fakeError);
  });

  it('should redirect to login when response return 401 error', async () => {
    // Arrange
    const error: AxiosError = {
      response: {
        status: 401
      }
    } as AxiosError;
    const res = onRejectedRes(error);
    // Assert
    await expect(res).rejects.toEqual(error);
  });

})