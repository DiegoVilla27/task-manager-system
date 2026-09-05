import axiosInstance from '@core/axios';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { HttpResponseError } from './interfaces';

const interceptorErrors = (): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const responseData: HttpResponseError = error.response?.data as HttpResponseError;

      if (responseData?.message) {
        let toastMessage = responseData.message;

        if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          const fieldErrors = responseData.errors
            .map((err) => `• ${err.field}: ${err.message}`)
            .join('\n');

          toastMessage += `\n\n${fieldErrors}`;
        }

        toast.error(toastMessage, { duration: 10000 });
      } else {
        toast.error('Ocurrió un error inesperado. Por favor, reintenta.', { duration: 5000 });
      }

      return Promise.reject(error);
    },
  );
};

export default interceptorErrors;
