import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

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

  it('should return correct email error messages', () => {
    const emailCtrl = component.form.get('email');
    emailCtrl?.markAsTouched();

    emailCtrl?.setValue('');
    expect(component['emailError']()).toBe(
      'El correo electrónico es requerido',
    );

    emailCtrl?.setValue('invalid-email');
    expect(component['emailError']()).toBe(
      'Ingresa un formato de correo válido',
    );

    emailCtrl?.setValue('valid@test.com');
    expect(component['emailError']()).toBeNull();
  });

  it('should return correct password error messages', () => {
    const passCtrl = component.form.get('password');
    passCtrl?.markAsTouched();

    passCtrl?.setValue('');
    expect(component['passwordError']()).toBe('La contraseña es requerida');

    passCtrl?.setValue('123');
    expect(component['passwordError']()).toBe('Mínimo 6 caracteres requeridos');

    passCtrl?.setValue('validPass123!');
    expect(component['passwordError']()).toBeNull();
  });

  it('should not submit if form is invalid', () => {
    let submitted = false;
    component.submitted.subscribe(() => {
      submitted = true;
    });

    component.form.get('email')?.setValue('');
    component.handleSubmit();
    expect(submitted).toBeFalse();
  });

  it('should submit valid form data and navigate after timeout', fakeAsync(() => {
    let payload: unknown = null;
    component.submitted.subscribe((data) => {
      payload = data;
    });

    component.form.patchValue({
      email: 'admin@taskmanager.io',
      password: 'Password123!',
      rememberMe: false,
    });
    component.handleSubmit();

    expect(payload).toEqual({
      email: 'admin@taskmanager.io',
      password: 'Password123!',
      rememberMe: false,
    });
    expect(component.isLoading()).toBeTrue();

    tick(450);
    expect(component.isLoading()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/tasks']);
  }));
});
