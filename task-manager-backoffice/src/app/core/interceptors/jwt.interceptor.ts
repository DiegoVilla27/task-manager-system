import { HttpInterceptorFn } from '@angular/common/http';
import { StorageUtils } from '@shared/utils/storage.utils';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = StorageUtils.get<string>('access_token');
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
