import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { StorageService } from '@shared/services/storage.service';
import { environment } from '@environments/environment';
import {
  AuthLoginRequest,
  AuthResponse,
  UserMeResponse,
} from '@task-manager-system/api-types';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockUserMe: UserMeResponse = {
    id: 'user-123',
    email: 'admin@taskmanager.com',
    name: 'Admin',
    lastname: 'User',
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['me']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'get',
      'set',
      'remove',
      'clear',
    ]);

    userServiceSpy.me.and.returnValue(of(mockUserMe));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate user, save tokens in StorageService, and fetch me profile on login', (done) => {
    const payload: AuthLoginRequest = {
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
      expect(storageServiceSpy.set).toHaveBeenCalledWith(
        'access_token',
        'mock-access-token',
      );
      expect(storageServiceSpy.set).toHaveBeenCalledWith(
        'refresh_token',
        'mock-refresh-token',
      );
      expect(userServiceSpy.me).toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should remove tokens and navigate to login on logout', () => {
    service.logout();

    expect(storageServiceSpy.remove).toHaveBeenCalledWith('access_token');
    expect(storageServiceSpy.remove).toHaveBeenCalledWith('refresh_token');
    expect(storageServiceSpy.remove).toHaveBeenCalledWith('me');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should return true for isAuthenticated when access_token exists in storage', () => {
    storageServiceSpy.get.and.returnValue('token-abc');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated when no token in storage', () => {
    storageServiceSpy.get.and.returnValue(null);
    expect(service.isAuthenticated()).toBeFalse();
  });
});
