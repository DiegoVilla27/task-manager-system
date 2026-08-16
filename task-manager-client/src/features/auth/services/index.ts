import { httpService } from '@core/http';
import { getMeSvc } from '@features/users/service';
import StorageService from '@shared/utils/storage';
import type { AuthLoginRequest, AuthRegisterRequest } from '../interfaces/request';
import type { AuthResponse } from '../interfaces/response';

const API_AUTH = '/auth';

const loginSvc = async (payload: AuthLoginRequest): Promise<AuthResponse | null> => {
  const res = await httpService.post<AuthResponse>(`${API_AUTH}/login`, payload);
  await saveTokensSvc(res);

  return res;
};

const registerSvc = async (payload: AuthRegisterRequest): Promise<AuthResponse | null> => {
  const res = await httpService.post<AuthResponse>(`${API_AUTH}/register`, payload);
  await saveTokensSvc(res);

  return res;
};

const logoutSvc = () => {
  StorageService.remove('TOKEN');
  StorageService.remove('REFRESH');
  StorageService.remove('ME');
};

const saveTokensSvc = async (tokens: AuthResponse) => {
  StorageService.set('TOKEN', tokens.access_token);
  StorageService.set('REFRESH', tokens.refresh_token);
  await getMeSvc();
};

export { loginSvc, logoutSvc, registerSvc };
