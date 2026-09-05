import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  ModalComponent,
} from '@shared/components/ui';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { CreateUserRequest } from '../interfaces/request';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Nuevo Usuario"
      subtitle="Otorga acceso al sistema"
      size="xl"
      (closed)="handleClose()"
    >
      <form
        [formGroup]="form"
        (ngSubmit)="handleSubmit()"
        class="space-y-4"
        novalidate
        autocomplete="off"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <app-form-field label="Nombre" forId="create-user-name">
            <app-input
              id="create-user-name"
              placeholder="John"
              type="text"
              formControlName="name"
            />
          </app-form-field>

          <!-- Email -->
          <app-form-field label="Apellido" forId="create-user-lastname">
            <app-input
              id="create-user-lastname"
              type="text"
              placeholder="Doe"
              formControlName="lastname"
            />
          </app-form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <app-form-field label="Correo electrónico" forId="create-user-email">
            <app-input
              id="create-user-email"
              placeholder="user@example.com"
              type="email"
              formControlName="email"
            />
          </app-form-field>
          <app-form-field label="Contraseña" forId="create-user-password">
            <app-input
              id="create-user-password"
              placeholder="*******"
              type="password"
              formControlName="password"
              autocomplete="new-password"
            />
          </app-form-field>
        </div>

        <!-- Action Buttons in Modal Footer -->
        <div
          modal-footer
          class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800"
        >
          <app-button
            type="button"
            variant="outline"
            size="md"
            (clicked)="handleClose()"
          >
            Cancelar
          </app-button>

          <app-button type="submit" variant="primary" size="md">
            Crear Usuario
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateModalComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly usersSvc = inject(UserService);
  private readonly queryClient = inject(QueryClient);

  readonly isOpen = input.required<boolean>();
  readonly close = output<void>();

  readonly form: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    lastname: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(150)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  readonly createUserMutation = injectMutation(() => ({
    mutationFn: (payload: CreateUserRequest) =>
      firstValueFrom(this.usersSvc.createUser(payload)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/users'] }),
  }));

  handleClose(): void {
    this.form.reset({
      name: '',
      lastname: '',
      email: '',
      password: '',
    });
    this.close.emit();
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as CreateUserRequest;
    await this.createUserMutation.mutate(payload);

    this.handleClose();
  }
}
