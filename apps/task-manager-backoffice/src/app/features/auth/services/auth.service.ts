import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { StorageService } from '@shared/services/storage.service';
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
  private readonly storageSvc = inject(StorageService);

  public login(payload: LoginRequest): Observable<UserMeResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_AUTH}/login`, payload)
      .pipe(
        tap((res) => this.saveTokens(res.access_token, res.refresh_token)),
        switchMap(() => this.usersSvc.me()),
      );
  }

  public logout(): void {
    this.storageSvc.remove('access_token');
    this.storageSvc.remove('refresh_token');
    this.storageSvc.remove('me');
    this.router.navigateByUrl('/auth/login');
  }

  public isAuthenticated(): boolean {
    return !!this.storageSvc.get('access_token');
  }

  private saveTokens(token: string, refresh: string): void {
    this.storageSvc.set('access_token', token);
    this.storageSvc.set('refresh_token', refresh);
  }
}
