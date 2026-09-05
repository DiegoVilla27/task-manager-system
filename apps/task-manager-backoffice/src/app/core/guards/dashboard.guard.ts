import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { ToastService } from '@shared/services/toast.service';
import { catchError, map, of } from 'rxjs';

const emailAdmin = 'admin@taskmanager.com';

/**
 * Route protection guard for guest-only pages (e.g. Login, Registration).
 * Blocks access to authenticated users by redirecting them back to the dashboard panels.
 *
 * @param route - The active route snapshot.
 * @param state - The active router state snapshot.
 * @returns Boolean resolving to true if guest access is allowed, false otherwise.
 */
export const dashboardGuard: CanActivateFn = () => {
  const authSvc = inject(AuthService);
  const userSvc = inject(UserService);
  const toastSvc = inject(ToastService);

  // 1. Si ni siquiera tiene token guardado, denegamos el acceso inmediatamente
  if (!authSvc.isAuthenticated()) {
    authSvc.logout();
    return false;
  }

  // 2. Si la Signal en memoria ya tiene al usuario, validamos su rol de forma síncrona
  const currentUser = userSvc.user$();
  if (currentUser) {
    if (currentUser.email === emailAdmin) {
      return true; // Coincidencia permitida, descarga el código
    }
    toastSvc.error('Acceso denegado. Se requieren permisos de Administrador.');
    authSvc.logout();
    return false;
  }

  // 3. 🚀 CONTROL DE F5 / ALMACENAMIENTO ALTERADO:
  // Si hay token pero la Signal está vacía, resincronizamos la identidad real contra el backend
  return userSvc.me().pipe(
    map((user) => {
      if (user?.email === emailAdmin) {
        return true;
      }
      toastSvc.error(
        'Acceso denegado. Se requieren permisos de Administrador.',
      );
      authSvc.logout();
      return false;
    }),
    catchError(() => {
      authSvc.logout();
      return of(false);
    }),
  );
};
