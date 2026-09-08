import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '@features/auth/services/auth.service';
import { Router } from '@angular/router';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserMeResponse } from '@task-manager-system/api-types';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUserMe: UserMeResponse = {
    id: '1',
    email: 'admin@taskmanager.com',
    name: 'Admin',
    lastname: 'User',
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    authServiceSpy.login.and.returnValue(of(mockUserMe));

    TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize default form values', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBeTrue();
  });

  it('should toggle password visibility signal', () => {
    expect(component.showPassword()).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBeTrue();
  });

  it('should not submit if form is invalid', async () => {
    component.form.setValue({ email: '', password: '' });
    await component.handleSubmit();

    expect(component.form.invalid).toBeTrue();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should submit form, call authService.login and navigate to /dashboard/users', async () => {
    component.form.setValue({
      email: 'admin@taskmanager.com',
      password: 'password123',
    });

    await component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@taskmanager.com',
      password: 'password123',
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard/users');
  });
});
