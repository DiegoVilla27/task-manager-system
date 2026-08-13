import { getMeSvc } from '@features/users/service';
import StorageService from '@shared/utils/storage';
import { useEffect } from 'react';

const useMe = () => {
  const token = StorageService.get('TOKEN');

  const getMe = async () => {
    if (token) {
      await getMeSvc();
    }
  }

  useEffect(() => {
    getMe();
  }, []);
}

export default useMe