import { environment } from '@core/environments';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
