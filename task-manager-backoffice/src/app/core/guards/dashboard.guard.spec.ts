import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, isObservable } from 'rxjs';
import { signal } from '@angular/core';
import { dashboardGuard } from './dashboard.guard';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { ToastService } from '@shared/services/toast.service';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';

describe('dashboardGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let userSignal = signal<UserMeResponse | null>(null);

  const mockAdmin: UserMeResponse = {
    id: '1',
    name: 'Admin',
    lastname: 'User',
    email: 'admin@taskmanager.com',
  };

  const mockNonAdmin: UserMeResponse = {
    id: '2',
    name: 'Regular',
    lastname: 'User',
    email: 'regular@taskmanager.com',
  };

  const executeGuard = (
    route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot,
    state: RouterStateSnapshot = {} as RouterStateSnapshot,
  ) => TestBed.runInInjectionContext(() => dashboardGuard(route, state));

  beforeEach(() => {
    userSignal = signal<UserMeResponse | null>(null);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
      'logout',
    ]);
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['me'], {
      user$: userSignal.asReadonly(),
    });
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', [
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    });
  });

  it('should logout and return false if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = executeGuard();
    expect(result).toBeFalse();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should allow access synchronously if user signal contains admin email', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(mockAdmin);

    const result = executeGuard();
    expect(result).toBeTrue();
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
  });

  it('should deny access and logout synchronously if user signal is not admin', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(mockNonAdmin);

    const result = executeGuard();
    expect(result).toBeFalse();
    expect(toastServiceSpy.error).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should call me() and allow access if remote user is admin on signal empty', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(of(mockAdmin));

    const result = executeGuard();
    expect(isObservable(result)).toBeTrue();

    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBeTrue();
        done();
      });
    }
  });

  it('should call me() and deny access if remote user is not admin', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(of(mockNonAdmin));

    const result = executeGuard();
    expect(isObservable(result)).toBeTrue();

    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBeFalse();
        expect(toastServiceSpy.error).toHaveBeenCalled();
        expect(authServiceSpy.logout).toHaveBeenCalled();
        done();
      });
    }
  });

  it('should logout and return false if me() fails with error', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(
      throwError(() => new Error('Server error')),
    );

    const result = executeGuard();
    expect(isObservable(result)).toBeTrue();

    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBeFalse();
        expect(authServiceSpy.logout).toHaveBeenCalled();
        done();
      });
    }
  });
});
