import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router'; // 🚀 Cambiamos el tipo de importación';
import { AuthService } from '@features/auth/services/auth.service';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true; // Acceso permitido (no está autenticado, puede ver Login/Register)
  }

  // Si ya tiene sesión, lo mandamos al panel principal
  router.navigateByUrl('/dashboard/users');
  return false;
};
