import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageSvc = inject(StorageService);
  const token = storageSvc.get<string>('access_token');
  let authReq = req;

  // Inject active session credentials into compatible outbound request targets
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq);
};
