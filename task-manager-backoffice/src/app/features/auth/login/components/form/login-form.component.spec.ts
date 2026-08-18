import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '@features/auth/services/auth.service';
import { UserMeResponse } from '@features/dashboard/pages/users/interfaces/response';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUserMe: UserMeResponse = {
    id: '123',
    name: 'Admin',
    lastname: 'User',
    email: 'admin@taskmanager.com',
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
    ]);
    authServiceSpy.login.and.returnValue(of(mockUserMe));

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        provideRouter([]),
        provideTanStackQuery(new QueryClient()),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBeFalse();
  });

  it('should not submit if form is invalid', async () => {
    component.form.get('email')?.setValue('');
    await component.handleSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should submit valid form data, trigger login mutation and navigate to users on success', async () => {
    component.form.patchValue({
      email: 'admin@taskmanager.com',
      password: 'validPassword123',
    });

    await component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@taskmanager.com',
      password: 'validPassword123',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard/users');
  });
});
