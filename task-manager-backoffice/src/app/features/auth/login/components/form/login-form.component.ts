import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '@features/auth/interfaces/request';
import { AuthService } from '@features/auth/services/auth.service';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
} from '@shared/components/ui';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: 'login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly authSvc = inject(AuthService);

  readonly showPassword = signal<boolean>(false);
  readonly form: FormGroup = this.fb.group({
    email: ['admin@taskmanager.com', [Validators.required, Validators.email]],
    password: ['12345678', [Validators.required]],
  });

  readonly loginMutation = injectMutation(() => ({
    mutationFn: (payload: LoginRequest) =>
      firstValueFrom(this.authSvc.login(payload)),
  }));

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as LoginRequest;

    await this.loginMutation.mutateAsync(payload, {
      onSuccess: () => this.router.navigateByUrl('/dashboard/users'),
    });
  }
}
