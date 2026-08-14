import { httpService } from "@core/http";
import StorageService from "@shared/utils/storage";
import type { UserMeResponse } from "../interfaces/response";

const API_USERS = "/users";

const getMeSvc = async (): Promise<UserMeResponse | null> => {
  try {
    const res = await httpService.get<UserMeResponse>(`${API_USERS}/me`);

    if (res) {
      StorageService.set("ME", res);
    }

    return res;
  } catch {
    return null;
  }
}

export { getMeSvc };
