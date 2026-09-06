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
import { AuthLoginRequest } from '@task-manager-system/api-types';
import { AuthService } from '@features/auth/services/auth.service';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
} from '@shared/components/ui';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import {
  LucideAtSign,
  LucideEye,
  LucideEyeClosed,
  LucideKeyRound,
  LucideArrowRight,
} from '@lucide/angular';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
    LucideAtSign,
    LucideKeyRound,
    LucideEye,
    LucideEyeClosed,
    LucideArrowRight,
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
    mutationFn: (payload: AuthLoginRequest) =>
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

    const payload = this.form.value as AuthLoginRequest;

    await this.loginMutation.mutateAsync(payload, {
      onSuccess: () => this.router.navigateByUrl('/dashboard/users'),
    });
  }
}
