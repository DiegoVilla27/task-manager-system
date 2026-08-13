import { logoutSvc } from '@features/auth/services';
import type { UserMeResponse } from '@features/users/interfaces/response';
import StorageService from '@shared/utils/storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useHeader = () => {

  const [user, setUser] = useState<UserMeResponse | null>(null);
  const navigate = useNavigate();

  const logout = () => {
    logoutSvc();
    navigate('/auth/login');
  };

  useEffect(() => {
    setUser(StorageService.get<UserMeResponse>('ME'));
  }, []);

  return {
    user,
    logout
  };
};

export default useHeader