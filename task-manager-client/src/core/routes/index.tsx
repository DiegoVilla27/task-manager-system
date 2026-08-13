import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const UsersPage = lazy(() => import('@features/users'));

const router = createBrowserRouter([
  {
    path: '/users',
    element: (
      <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
        <UsersPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/users" replace />,
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
