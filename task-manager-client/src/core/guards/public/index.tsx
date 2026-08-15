import StorageService from '@shared/utils/storage';
import { Navigate, Outlet } from 'react-router-dom';

const PublicGuard = () => {
  const token = StorageService.get<string>('TOKEN');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicGuard;
