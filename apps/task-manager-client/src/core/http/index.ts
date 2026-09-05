import axiosInstance from '@core/axios';
import { cleanParams } from '@shared/utils/clean-params';
import { type AxiosProgressEvent, type AxiosRequestConfig } from 'axios';

/**
 * Enterprise HTTP Client wrapper service around Axios.
 *
 * @remarks
 * Provides a standardized interface for network operations. Automatically cleans query
 * parameters by stripping `undefined`, `null`, or empty string values prior to dispatching requests,
 * and directly unpacks data payloads from Axios responses.
 *
 * @example
 * ```typescript
 * import { httpService } from '@/core/api/http';
 *
 * const users = await httpService.get<User[]>('/users', { role: 'ADMIN' });
 * ```
 */
export const httpService = {
  /**
   * Performs an HTTP GET request to fetch resources from the specified endpoint.
   *
   * @remarks
   * Merges `params` with `config.params` and sanitizes them using {@link cleanParams}.
   *
   * @typeParam T - The expected response data payload structure.
   *
   * @param url - The target endpoint path relative to the API base URL.
   * @param params - Optional query parameters object to be sanitized and appended to the URL.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving directly to the unpacked response data of type `T`.
   *
   * @throws {AxiosError} When network failures, HTTP 4xx, or 5xx status codes occur.
   *
   * @example
   * ```typescript
   * const book = await httpService.get<Book>('/books/123', { includeAuthor: true });
   * ```
   */
  get: async <T>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const mergedParams = { ...params, ...config?.params };
    const { data } = await axiosInstance.get<T>(url, {
      ...config,
      params: cleanParams(mergedParams),
    });
    return data;
  },

  /**
   * Performs an HTTP POST request to create a new resource or execute a remote procedure.
   *
   * @remarks
   * Sanitizes query parameters provided in `config.params` using {@link cleanParams}.
   *
   * @typeParam T - The expected response data payload structure.
   * @typeParam D - The request body payload data type. Defaults to `unknown`.
   *
   * @param url - The target endpoint path relative to the API base URL.
   * @param payload - Optional request body data to be transmitted.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving directly to the unpacked response data of type `T`.
   *
   * @throws {AxiosError} When validation errors (422), authorization failures (401/403), or server errors (500) occur.
   *
   * @example
   * ```typescript
   * const newBook = await httpService.post<Book, CreateBookDto>('/books', { title: 'Clean Code' });
   * ```
   */
  post: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.post<T>(url, payload, {
      ...config,
      params: cleanParams(config?.params),
    });
    return data;
  },

  /**
   * Performs an HTTP PATCH request to apply partial modifications to a resource.
   *
   * @remarks
   * Sanitizes query parameters provided in `config.params` using {@link cleanParams}.
   *
   * @typeParam T - The expected response data payload structure.
   * @typeParam D - The partial request body payload data type. Defaults to `unknown`.
   *
   * @param url - The target endpoint path relative to the API base URL.
   * @param payload - Partial dataset containing fields to update.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving directly to the unpacked response data of type `T`.
   *
   * @throws {AxiosError} When resource is not found (404) or validation fails (400/422).
   *
   * @example
   * ```typescript
   * const updatedUser = await httpService.patch<User, Partial<User>>('/users/me', { name: 'Diego' });
   * ```
   */
  patch: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.patch<T>(url, payload, {
      ...config,
      params: cleanParams(config?.params),
    });
    return data;
  },

  /**
   * Performs an HTTP PUT request to replace an existing resource or upload data completely.
   *
   * @remarks
   * Sanitizes query parameters provided in `config.params` using {@link cleanParams}.
   *
   * @typeParam T - The expected response data payload structure.
   * @typeParam D - The full request body payload data type. Defaults to `unknown`.
   *
   * @param url - The target endpoint path relative to the API base URL.
   * @param payload - The complete replacement resource dataset.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving directly to the unpacked response data of type `T`.
   *
   * @throws {AxiosError} When authorization or target resource constraints are violated.
   *
   * @example
   * ```typescript
   * const result = await httpService.put<User, User>('/users/123', fullUserPayload);
   * ```
   */
  put: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.put<T>(url, payload, {
      ...config,
      params: cleanParams(config?.params),
    });
    return data;
  },

  /**
   * Performs an HTTP DELETE request to remove a specific resource.
   *
   * @remarks
   * Sanitizes query parameters provided in `config.params` using {@link cleanParams}.
   *
   * @typeParam T - The expected response data payload structure.
   *
   * @param url - The target endpoint path relative to the API base URL.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving directly to the unpacked response data of type `T`.
   *
   * @throws {AxiosError} When the resource cannot be deleted or does not exist.
   *
   * @example
   * ```typescript
   * await httpService.delete<{ success: boolean }>('/books/456');
   * ```
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await axiosInstance.delete<T>(url, {
      ...config,
      params: cleanParams(config?.params),
    });
    return data;
  },

  /**
   * Specialized upload helper method for multi-part file transmission (`multipart/form-data`).
   *
   * @remarks
   * Overrides headers to enforce `multipart/form-data` and attaches the optional progress tracking handler.
   *
   * @typeParam T - The expected response data payload structure.
   *
   * @param url - The target upload endpoint path.
   * @param formData - Form data instance containing binary files and supplementary payload fields.
   * @param onUploadProgress - Callback executed periodically with upload byte transfer status.
   * @param config - Additional Axios request configuration options.
   *
   * @returns A promise resolving to the server's upload response of type `T`.
   *
   * @throws {AxiosError} When payload size limits are exceeded or file validation fails on the server.
   *
   * @example
   * ```typescript
   * const data = new FormData();
   * data.append('file', fileBlob);
   * const res = await httpService.upload<{ url: string }>('/users/avatar', data, (event) => {
   *   console.log(`Progress: ${event.loaded}/${event.total}`);
   * });
   * ```
   */
  upload: async <T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.put<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      params: cleanParams(config?.params),
      onUploadProgress,
    });
    return data;
  },
};
