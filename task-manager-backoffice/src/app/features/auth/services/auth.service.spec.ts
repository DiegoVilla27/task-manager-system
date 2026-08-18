import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { StorageUtils } from '@shared/utils/storage.utils';
import { environment } from '@environments/environment';
import { LoginRequest } from '../interfaces/request';
import { AuthResponse } from '../interfaces/response';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUserMe: UserMeResponse = {
    id: 'user-1',
    name: 'Admin',
    lastname: 'User',
    email: 'admin@taskmanager.com',
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['me']);
    userServiceSpy.me.and.returnValue(of(mockUserMe));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  afterEach(() => {
    httpMock.verify();
    StorageUtils.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate user and save tokens on login', (done) => {
    const payload: LoginRequest = {
      email: 'admin@taskmanager.com',
      password: 'password123',
    };

    const mockResponse: AuthResponse = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
    };

    service.login(payload).subscribe((user) => {
      expect(user).toEqual(mockUserMe);
      expect(StorageUtils.get('access_token')).toBe('mock-access-token');
      expect(StorageUtils.get('refresh_token')).toBe('mock-refresh-token');
      expect(userServiceSpy.me).toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should clear tokens and navigate to login on logout', () => {
    StorageUtils.set('access_token', 'token');
    StorageUtils.set('refresh_token', 'refresh');
    StorageUtils.set('me', mockUserMe);

    service.logout();

    expect(StorageUtils.get('access_token')).toBeNull();
    expect(StorageUtils.get('refresh_token')).toBeNull();
    expect(StorageUtils.get('me')).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should return true for isAuthenticated when access_token exists', () => {
    StorageUtils.set('access_token', 'valid-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated when no token exists', () => {
    StorageUtils.remove('access_token');
    expect(service.isAuthenticated()).toBeFalse();
  });
});
