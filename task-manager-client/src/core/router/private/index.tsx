import PrivateGuard from '@core/guards/private';
import MainLayout from '@features/tasks/layouts';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const TasksPage = lazy(() => import('@features/tasks/pages'));

const PRIVATE_ROUTES = [
  {
    element: <PrivateGuard />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <TasksPage />,
          },
          {
            path: '*',
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
];

export default PRIVATE_ROUTES;
