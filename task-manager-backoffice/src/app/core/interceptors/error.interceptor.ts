import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';
import { catchError, throwError } from 'rxjs';

export interface ApiFieldError {
  field: string;
  value: unknown;
  message: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: ApiFieldError[];
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Network / CORS
      if (error.status === 0) {
        toast.error('No se pudo conectar con el servidor (CORS o red).');

        return throwError(() => error);
      }

      const apiError = error.error as ApiErrorResponse;

      // Backend error with message + field errors
      if (
        apiError?.message &&
        Array.isArray(apiError.errors) &&
        apiError.errors.length > 0
      ) {
        toast.error(apiError.message, apiError.errors);

        return throwError(() => error);
      }

      // Backend error with only message
      if (apiError?.message) {
        toast.error(apiError.message);

        return throwError(() => error);
      }

      // Unknown error
      toast.error('Ha ocurrido un error inesperado.');

      return throwError(() => error);
    }),
  );
};
