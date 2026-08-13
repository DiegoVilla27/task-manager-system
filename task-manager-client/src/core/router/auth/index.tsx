import PublicGuard from '@core/guards/public';
import AuthLayout from '@features/auth/layout';
import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('@features/auth/pages/login'));
const RegisterPage = lazy(() => import('@features/auth/pages/register'));

const AUTH_ROUTES: RouteObject[] = [
  {
    element: (
      <PublicGuard />
    ),
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: '',
            element: <Navigate to="/auth/login" replace />,
          },
        ]
      }
    ],
  },
];

export default AUTH_ROUTES;