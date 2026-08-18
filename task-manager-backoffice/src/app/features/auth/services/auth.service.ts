import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { StorageUtils } from '@shared/utils/storage.utils';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginRequest } from '../interfaces/request';
import { AuthResponse } from '../interfaces/response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_AUTH = `${environment.API_URL}/auth`;
  private readonly http = inject(HttpClient);
  private readonly usersSvc = inject(UserService);
  private readonly router = inject(Router);

  public login(payload: LoginRequest): Observable<UserMeResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_AUTH}/login`, payload)
      .pipe(
        tap((res) => this.saveTokens(res.access_token, res.refresh_token)),
        switchMap(() => this.usersSvc.me()),
      );
  }

  public logout(): void {
    StorageUtils.remove('access_token');
    StorageUtils.remove('refresh_token');
    StorageUtils.remove('me');
    this.router.navigateByUrl('/auth/login');
  }

  public isAuthenticated(): boolean {
    return !!StorageUtils.get('access_token');
  }

  private saveTokens(token: string, refresh: string): void {
    StorageUtils.set('access_token', token);
    StorageUtils.set('refresh_token', refresh);
  }
}
