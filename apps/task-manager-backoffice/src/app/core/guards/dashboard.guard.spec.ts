import { TestBed } from '@angular/core/testing';
import { dashboardGuard } from './dashboard.guard';
import { AuthService } from '@features/auth/services/auth.service';
import { UserService } from '@features/dashboard/pages/users/services/user.service';
import { ToastService } from '@shared/services/toast.service';
import { of, throwError } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';

describe('dashboardGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let userSignal: WritableSignal<UserMeResponse | null>;

  const mockAdmin: UserMeResponse = {
    id: '1',
    email: 'admin@taskmanager.com',
    name: 'Admin',
    lastname: 'User',
  };
  const mockNormalUser: UserMeResponse = {
    id: '2',
    email: 'user@taskmanager.com',
    name: 'Normal',
    lastname: 'User',
  };

  beforeEach(() => {
    userSignal = signal<UserMeResponse | null>(null);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'logout',
    ]);
    userServiceSpy = jasmine.createSpyObj('UserService', ['me'], {
      user$: userSignal,
    });
    userServiceSpy.me.and.returnValue(of(mockAdmin));
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    });
  });

  it('should logout and block if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    );
    expect(result).toBeFalse();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should allow access synchronously if user signal contains admin email', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(mockAdmin);

    const result = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    );
    expect(result).toBeTrue();
  });

  it('should deny access synchronously if user signal contains non-admin email', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(mockNormalUser);

    const result = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    );
    expect(result).toBeFalse();
    expect(toastServiceSpy.error).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should fetch user via me() and allow if admin', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(of(mockAdmin));

    const result$ = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    ) as any;
    result$.subscribe((allowed: boolean) => {
      expect(allowed).toBeTrue();
      done();
    });
  });

  it('should fetch user via me() and deny if not admin', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(of(mockNormalUser));

    const result$ = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    ) as any;
    result$.subscribe((allowed: boolean) => {
      expect(allowed).toBeFalse();
      expect(toastServiceSpy.error).toHaveBeenCalled();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      done();
    });
  });

  it('should catch error on me() failure and logout', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    userSignal.set(null);
    userServiceSpy.me.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    const result$ = TestBed.runInInjectionContext(() =>
      dashboardGuard({} as any, {} as any),
    ) as any;
    result$.subscribe((allowed: boolean) => {
      expect(allowed).toBeFalse();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      done();
    });
  });
});
