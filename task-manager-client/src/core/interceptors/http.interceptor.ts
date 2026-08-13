import axios from 'axios';
import { environment } from '@core/environments';

export const httpClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    // Inject auth token here if needed
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (401, 403, 500) here
    return Promise.reject(error);
  },
);
