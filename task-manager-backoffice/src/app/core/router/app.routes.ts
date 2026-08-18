import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { dashboardGuard } from '@core/guards/dashboard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canMatch: [authGuard],
    loadChildren: () =>
      import('@features/auth/routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canMatch: [dashboardGuard],
    loadChildren: () =>
      import('@features/dashboard/routes/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
