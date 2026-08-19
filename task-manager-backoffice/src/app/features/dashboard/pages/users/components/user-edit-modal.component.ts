import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
import { EditUserRequest } from '../interfaces/request';
import { UserResponse } from '../interfaces/response';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-edit-modal',
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
      [title]="'Editar Usuario: ' + (user()?.name || '')"
      subtitle="Modifica el usuario del sistema"
      size="xl"
      (closed)="handleClose()"
    >
      @if (user()) {
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
            <app-form-field
              label="Correo electrónico"
              forId="create-user-email"
            >
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
              Guardar Cambios
            </app-button>
          </div>
        </form>
      }
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditModalComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly usersSvc = inject(UserService);
  private readonly queryClient = inject(QueryClient);

  readonly isOpen = input.required<boolean>();
  readonly user = input<UserResponse | null>(null);
  readonly close = output<void>();

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.minLength(3), Validators.maxLength(100)]],
    lastname: ['', [Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.minLength(8), Validators.maxLength(20)]],
  });

  readonly editUserMutation = injectMutation(() => ({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: EditUserRequest;
    }) => firstValueFrom(this.usersSvc.updateUser(userId, payload)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/users'] }),
  }));

  constructor() {
    effect(() => {
      const current = this.user();
      if (current) {
        this.form.patchValue({
          name: current.name,
          lastname: current.lastname,
          email: current.email,
          password: '',
        });
      }
    });
  }

  handleClose(): void {
    this.form.patchValue({
      name: '',
      lastname: '',
      email: '',
      password: '',
    });
    this.close.emit();
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid || !this.user()) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as EditUserRequest;

    await this.editUserMutation.mutate({
      userId: this.user()!.id,
      payload,
    });

    this.handleClose();
  }
}
