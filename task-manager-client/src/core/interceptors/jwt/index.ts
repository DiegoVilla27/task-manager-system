import axiosInstance from "@core/axios";
import { logoutSvc } from "@features/auth/services";
import StorageService from "@shared/utils/storage";
import type { AxiosError } from "axios";

const interceptorJwtAuth = (): void => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const access_token = StorageService.get<string>('TOKEN');

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // LOGOUT AND REFRESH HERE
      if (error.response?.status === 401) {
        logoutSvc();
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    },
  );
}

export default interceptorJwtAuth;
