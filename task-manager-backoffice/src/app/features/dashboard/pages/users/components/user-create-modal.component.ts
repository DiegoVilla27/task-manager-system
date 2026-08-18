import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  SelectComponent,
  SelectOption,
} from '@shared/components/ui';
import { UserMock } from '../models/user.model';

@Component({
  selector: 'app-user-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Nuevo Usuario"
      subtitle="Otorga acceso al panel administrativo y asigna un rol inicial"
      size="xl"
      (close)="handleClose()"
    >
      <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <app-form-field
            label="Nombre Completo"
            forId="create-user-name"
            [required]="true"
            [error]="nameError()"
          >
            <app-input
              id="create-user-name"
              placeholder="Ej. Valeria Santana"
              formControlName="name"
              [error]="!!nameError()"
            />
          </app-form-field>

          <!-- Email -->
          <app-form-field
            label="Correo Electrónico"
            forId="create-user-email"
            [required]="true"
            [error]="emailError()"
          >
            <app-input
              id="create-user-email"
              type="email"
              placeholder="valeria@taskmanager.io"
              formControlName="email"
              [error]="!!emailError()"
            />
          </app-form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Role -->
          <app-form-field label="Rol de Acceso" forId="create-user-role">
            <app-select
              id="create-user-role"
              [options]="roleOptions"
              formControlName="role"
            />
          </app-form-field>

          <!-- Department -->
          <app-form-field label="Departamento / Área" forId="create-user-dept">
            <app-input
              id="create-user-dept"
              placeholder="Ej. DevOps & Cloud"
              formControlName="department"
            />
          </app-form-field>
        </div>

        <!-- Initial Status -->
        <app-form-field label="Estado Inicial" forId="create-user-status">
          <app-select
            id="create-user-status"
            [options]="statusOptions"
            formControlName="status"
          />
        </app-form-field>

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

  readonly isOpen = input.required<boolean>();

  readonly close = output<void>();
  readonly created = output<Partial<UserMock>>();

  readonly roleOptions: SelectOption[] = [
    { label: 'Super Admin (Acceso Total)', value: 'SUPER_ADMIN' },
    { label: 'Admin (Operador General)', value: 'ADMIN' },
    { label: 'Manager (Gestión & Reportes)', value: 'MANAGER' },
    { label: 'Developer (Ejecución de Tareas)', value: 'DEVELOPER' },
    { label: 'Viewer (Solo Lectura)', value: 'VIEWER' },
  ];

  readonly statusOptions: SelectOption[] = [
    { label: 'Activo (Acceso Inmediato)', value: 'ACTIVE' },
    { label: 'Pendiente (Enviar Invitación)', value: 'PENDING' },
    { label: 'Inactivo', value: 'INACTIVE' },
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['DEVELOPER'],
    department: ['Frontend Engineering'],
    status: ['ACTIVE'],
  });

  protected nameError(): string | null {
    const ctrl = this.form.get('name');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'El nombre es obligatorio (mínimo 3 caracteres)';
    }
    return null;
  }

  protected emailError(): string | null {
    const ctrl = this.form.get('email');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'Ingresa un correo electrónico corporativo válido';
    }
    return null;
  }

  handleClose(): void {
    this.form.reset({
      name: '',
      email: '',
      role: 'DEVELOPER',
      department: 'Frontend Engineering',
      status: 'ACTIVE',
    });
    this.close.emit();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const initials = val.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    this.created.emit({
      name: val.name,
      email: val.email,
      role: val.role,
      department: val.department,
      status: val.status,
      avatarBg: 'from-cyan-500 to-blue-600',
      initials,
      assignedTasks: 0,
      lastLogin: 'Nunca',
      createdAt: 'Hoy',
    });

    this.handleClose();
  }
}
