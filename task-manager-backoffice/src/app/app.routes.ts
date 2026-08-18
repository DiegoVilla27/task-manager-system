import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/tasks',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./core/layout/backoffice-layout.component').then(
        (m) => m.BackofficeLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/dashboard/tasks/tasks-list.component').then(
            (m) => m.TasksListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/dashboard/users/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard/tasks',
  },
];
