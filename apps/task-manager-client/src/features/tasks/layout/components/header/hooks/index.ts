import { logoutSvc } from '@features/auth/services';
import StorageService from '@shared/utils/storage';
import type { UserMeResponse } from '@task-manager-system/api-types';
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
    logout,
  };
};

export default useHeader;
