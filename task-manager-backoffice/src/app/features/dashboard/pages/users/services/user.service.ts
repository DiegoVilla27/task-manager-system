import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { StorageUtils } from '@shared/utils/storage.utils';
import { Observable, tap } from 'rxjs';
import {
  UserMeResponse,
  UserResponse,
  UsersPagination,
} from '../interfaces/response';
import {
  CreateUserRequest,
  EditUserRequest,
  UsersPaginationRequest,
} from '../interfaces/request';
import { cleanParams } from '@shared/utils/clean-params.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_USERS = `${environment.API_URL}/users`;
  private readonly http = inject(HttpClient);

  private readonly _user$ = signal<UserMeResponse | null>(null);
  public readonly user$ = this._user$.asReadonly();

  public me(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(`${this.BASE_USERS}/me`).pipe(
      tap((res) => {
        this.saveMe(res);
        this._user$.set(res);
      }),
    );
  }

  public getUsers(
    payload: UsersPaginationRequest,
  ): Observable<UsersPagination> {
    const params = cleanParams(payload);
    return this.http.get<UsersPagination>(this.BASE_USERS, { params });
  }

  public createUser(payload: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.BASE_USERS, payload);
  }

  public updateUser(
    userId: string,
    payload: EditUserRequest,
  ): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.BASE_USERS}/${userId}`,
      payload,
    );
  }

  public deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_USERS}/${userId}`);
  }

  public saveMe(userMe: UserMeResponse): void {
    StorageUtils.set('me', userMe);
  }
}
