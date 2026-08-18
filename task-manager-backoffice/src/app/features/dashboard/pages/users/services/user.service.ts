import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { StorageUtils } from '@shared/utils/storage.utils';
import { Observable, tap } from 'rxjs';
import { UserMeResponse } from '../interfaces/response';

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

  public saveMe(userMe: UserMeResponse): void {
    StorageUtils.set('me', userMe);
  }
}
