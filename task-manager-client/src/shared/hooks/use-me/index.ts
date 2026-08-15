import { getMeSvc } from '@features/users/service';
import StorageService from '@shared/utils/storage';
import { useEffect } from 'react';

const useMe = () => {
  useEffect(() => {
    const token = StorageService.get('TOKEN');
    if (token) {
      getMeSvc();
    }
  }, []);
};

export default useMe;
