import { TestBed } from '@angular/core/testing';
import { Router, Route, UrlSegment } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@features/auth/services/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const executeGuard = (route: Route = {}, segments: UrlSegment[] = []) =>
    TestBed.runInInjectionContext(() => authGuard(route, segments));

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow matching if user is not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = executeGuard();
    expect(result).toBeTrue();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should block matching and redirect to /dashboard/users if user is already authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = executeGuard();
    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard/users');
  });
});
