import { createBrowserRouter, Navigate } from 'react-router-dom';
import AUTH_ROUTES from '../auth';
import PRIVATE_ROUTES from '../private';

const routerConfig = [
  ...AUTH_ROUTES,
  ...PRIVATE_ROUTES,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default createBrowserRouter(routerConfig);
