import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/dashboard/layout/backoffice-layout.component').then(
        (m) => m.BackofficeLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('@features/dashboard/pages/tasks/tasks-list.component').then(
            (m) => m.TasksListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@features/dashboard/pages/users/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
    ],
  },
];
