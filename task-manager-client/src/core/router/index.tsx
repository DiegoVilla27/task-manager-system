import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AUTH_ROUTES from './auth';
import PRIVATE_ROUTES from './private';
import useMe from '@shared/hooks/use-me';

const router = createBrowserRouter([
  ...AUTH_ROUTES,
  ...PRIVATE_ROUTES,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRoutes: React.FC = () => {
  useMe();

  return <RouterProvider router={router} />;
};

export default AppRoutes;
