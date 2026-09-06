import { httpService } from '@core/http';
import StorageService from '@shared/utils/storage';
import type { UserMeResponse } from '@task-manager-system/api-types';

const API_USERS = '/users';

const getMeSvc = async (): Promise<UserMeResponse | null> => {
  const res = await httpService.get<UserMeResponse>(`${API_USERS}/me`);
  StorageService.set('ME', res);

  return res;
};

export { getMeSvc };
