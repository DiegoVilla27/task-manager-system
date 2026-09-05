import useMe from '@shared/hooks/use-me';
import { RouterProvider } from 'react-router-dom';
import router from './config';

const AppRoutes: React.FC = () => {
  useMe();

  return <RouterProvider router={router} />;
};

export default AppRoutes;
