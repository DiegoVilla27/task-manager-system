import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  BadgeComponent,
  ButtonComponent,
  CheckboxComponent,
  FormFieldComponent,
  InputComponent,
} from '@shared/components/ui';

export interface LoginFormValue {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  template: `
    <div
      class="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80"
    >
      <div
        class="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80"
      >
        <div>
          <h2 class="text-lg font-semibold text-white">Iniciar Sesión</h2>
          <p class="text-xs text-slate-400">
            Ingresa tus credenciales de backoffice
          </p>
        </div>
        <app-badge variant="success" [dot]="true" [pulse]="true">
          2FA Habilitado
        </app-badge>
      </div>

      <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
        <!-- Email Field -->
        <app-form-field
          label="Correo Electrónico / Usuario"
          forId="login-email"
          [required]="true"
          [error]="emailError()"
        >
          <app-input
            id="login-email"
            type="email"
            placeholder="admin@taskmanager.io"
            formControlName="email"
            [hasPrefix]="true"
            [error]="!!emailError()"
          >
            <svg
              prefix
              class="w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
              />
            </svg>
          </app-input>
        </app-form-field>

        <!-- Password Field -->
        <app-form-field
          label="Contraseña"
          forId="login-password"
          [required]="true"
          [error]="passwordError()"
        >
          <button
            label-action
            type="button"
            class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium bg-transparent border-0 p-0 cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <app-input
            id="login-password"
            [type]="showPassword() ? 'text' : 'password'"
            placeholder="••••••••••••"
            formControlName="password"
            [hasPrefix]="true"
            [hasSuffix]="true"
            [error]="!!passwordError()"
          >
            <svg
              prefix
              class="w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <button
              suffix
              type="button"
              (click)="togglePasswordVisibility()"
              class="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0 p-0"
              [attr.aria-label]="
                showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'
              "
            >
              @if (showPassword()) {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              } @else {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            </button>
          </app-input>
        </app-form-field>

        <!-- Remember Me & Security Level -->
        <div class="flex items-center justify-between pt-1">
          <app-checkbox
            id="login-remember-me"
            label="Recordar sesión (30 días)"
            formControlName="rememberMe"
          />
          <span class="text-[11px] text-slate-500 font-mono"
            >SSL / TLS 1.3</span
          >
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isLoading()"
          >
            <span>Acceder al Panel</span>
            <svg
              class="w-4 h-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </app-button>
        </div>
      </form>

      <!-- SSO Slot -->
      <ng-content select="app-login-sso, [sso]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);

  readonly submitted = output<LoginFormValue>();

  readonly showPassword = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly form: FormGroup = this.fb.group({
    email: ['admin@taskmanager.io', [Validators.required, Validators.email]],
    password: [
      'SuperSecret123!',
      [Validators.required, Validators.minLength(6)],
    ],
    rememberMe: [true],
  });

  protected emailError(): string | null {
    const ctrl = this.form.get('email');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.errors?.['required'])
        return 'El correo electrónico es requerido';
      if (ctrl.errors?.['email']) return 'Ingresa un formato de correo válido';
    }
    return null;
  }

  protected passwordError(): string | null {
    const ctrl = this.form.get('password');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.errors?.['required']) return 'La contraseña es requerida';
      if (ctrl.errors?.['minlength']) return 'Mínimo 6 caracteres requeridos';
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const value = this.form.getRawValue() as LoginFormValue;
    this.submitted.emit(value);

    // Simulate navigation
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/dashboard/tasks']);
    }, 400);
  }
}
