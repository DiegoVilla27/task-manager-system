import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
  selector: 'app-user-edit-modal',
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
      [title]="'Editar Usuario: ' + (user()?.name || '')"
      subtitle="Modifica el rol, departamento y estado de la cuenta"
      size="xl"
      (closed)="handleClose()"
    >
      @if (user()) {
        <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Full Name -->
            <app-form-field
              label="Nombre Completo"
              forId="edit-user-name"
              [required]="true"
              [error]="nameError()"
            >
              <app-input
                id="edit-user-name"
                formControlName="name"
                [error]="!!nameError()"
              />
            </app-form-field>

            <!-- Email -->
            <app-form-field
              label="Correo Electrónico"
              forId="edit-user-email"
              [required]="true"
              [error]="emailError()"
            >
              <app-input
                id="edit-user-email"
                type="email"
                formControlName="email"
                [error]="!!emailError()"
              />
            </app-form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Role -->
            <app-form-field label="Rol de Acceso" forId="edit-user-role">
              <app-select
                id="edit-user-role"
                [options]="roleOptions"
                formControlName="role"
              />
            </app-form-field>

            <!-- Department -->
            <app-form-field label="Departamento / Área" forId="edit-user-dept">
              <app-input id="edit-user-dept" formControlName="department" />
            </app-form-field>
          </div>

          <!-- Status -->
          <app-form-field label="Estado de Cuenta" forId="edit-user-status">
            <app-select
              id="edit-user-status"
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

  readonly isOpen = input.required<boolean>();
  readonly user = input<UserMock | null>(null);

  readonly closed = output<void>();
  readonly saved = output<UserMock>();

  readonly roleOptions: SelectOption[] = [
    { label: 'Super Admin (Acceso Total)', value: 'SUPER_ADMIN' },
    { label: 'Admin (Operador General)', value: 'ADMIN' },
    { label: 'Manager (Gestión & Reportes)', value: 'MANAGER' },
    { label: 'Developer (Ejecución de Tareas)', value: 'DEVELOPER' },
    { label: 'Viewer (Solo Lectura)', value: 'VIEWER' },
  ];

  readonly statusOptions: SelectOption[] = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Inactivo', value: 'INACTIVE' },
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['DEVELOPER'],
    department: [''],
    status: ['ACTIVE'],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      if (current) {
        this.form.patchValue({
          name: current.name,
          email: current.email,
          role: current.role,
          department: current.department,
          status: current.status,
        });
      }
    });
  }

  protected nameError(): string | null {
    const ctrl = this.form.get('name');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'El nombre es obligatorio';
    }
    return null;
  }

  protected emailError(): string | null {
    const ctrl = this.form.get('email');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'Ingresa un correo electrónico válido';
    }
    return null;
  }

  handleClose(): void {
    this.closed.emit();
  }

  handleSubmit(): void {
    if (this.form.invalid || !this.user()) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const current = this.user()!;

    this.saved.emit({
      ...current,
      name: val.name,
      email: val.email,
      role: val.role,
      department: val.department,
      status: val.status,
    });

    this.handleClose();
  }
}
