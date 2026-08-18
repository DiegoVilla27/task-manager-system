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
  TextareaComponent,
} from '@shared/components/ui';
import { TaskMock } from '../models/task.model';

@Component({
  selector: 'app-task-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Crear Nueva Tarea"
      subtitle="Asigna y planifica una nueva actividad para el equipo"
      size="xl"
      (close)="handleClose()"
    >
      <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
        <!-- Title -->
        <app-form-field
          label="Título de la Tarea"
          forId="create-task-title"
          [required]="true"
          [error]="titleError()"
        >
          <app-input
            id="create-task-title"
            placeholder="Ej. Implementar integración OAuth2 con Google"
            formControlName="title"
            [error]="!!titleError()"
          />
        </app-form-field>

        <!-- Description -->
        <app-form-field
          label="Descripción Detallada"
          forId="create-task-desc"
          [required]="true"
          [error]="descError()"
        >
          <app-textarea
            id="create-task-desc"
            [rows]="3"
            placeholder="Detalla los requerimientos, endpoints necesarios o criterios de aceptación..."
            formControlName="description"
            [error]="!!descError()"
          />
        </app-form-field>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Initial Status -->
          <app-form-field label="Estado Inicial" forId="create-task-status">
            <app-select
              id="create-task-status"
              [options]="statusOptions"
              formControlName="status"
            />
          </app-form-field>

          <!-- Due Date -->
          <app-form-field label="Fecha Límite" forId="create-task-due">
            <app-input
              id="create-task-due"
              type="text"
              placeholder="Ej. 28 Feb 2026"
              formControlName="dueDate"
            />
          </app-form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Assignee -->
          <app-form-field label="Asignar a" forId="create-task-assignee">
            <app-select
              id="create-task-assignee"
              [options]="assigneeOptions"
              formControlName="assignee"
            />
          </app-form-field>

          <!-- Tags -->
          <app-form-field
            label="Etiquetas (separadas por coma)"
            forId="create-task-tags"
          >
            <app-input
              id="create-task-tags"
              type="text"
              placeholder="Backend, API, Urgent"
              formControlName="tags"
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
            Guardar Tarea
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateModalComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly isOpen = input.required<boolean>();

  readonly close = output<void>();
  readonly created = output<Partial<TaskMock>>();

  readonly statusOptions: SelectOption[] = [
    { label: 'Por Hacer (TODO)', value: 'TODO' },
    { label: 'En Progreso (IN_PROGRESS)', value: 'IN_PROGRESS' },
    { label: 'Completada (COMPLETED)', value: 'COMPLETED' },
  ];

  readonly assigneeOptions: SelectOption[] = [
    { label: 'Diego Villa (Super Admin)', value: 'Diego Villa' },
    { label: 'Alejandro Morales (Frontend)', value: 'Alejandro Morales' },
    { label: 'Camila Rodriguez (Product)', value: 'Camila Rodriguez' },
    { label: 'Sofia Hernandez (Backend)', value: 'Sofia Hernandez' },
    { label: 'Carlos Mendoza (QA)', value: 'Carlos Mendoza' },
  ];

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['TODO'],
    dueDate: ['28 Feb 2026'],
    assignee: ['Diego Villa'],
    tags: ['Backend, API'],
  });

  protected titleError(): string | null {
    const ctrl = this.form.get('title');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'El título es obligatorio (mínimo 3 caracteres)';
    }
    return null;
  }

  protected descError(): string | null {
    const ctrl = this.form.get('description');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'La descripción es obligatoria';
    }
    return null;
  }

  handleClose(): void {
    this.form.reset({
      title: '',
      description: '',
      status: 'TODO',
      dueDate: '28 Feb 2026',
      assignee: 'Diego Villa',
      tags: 'Backend, API',
    });
    this.close.emit();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const tagArray = val.tags
      ? val.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : ['Task'];

    this.created.emit({
      title: val.title,
      description: val.description,
      status: val.status,
      dueDate: val.dueDate,
      assignee: {
        name: val.assignee,
        avatarBg: 'from-indigo-600 to-purple-600',
        initials: val.assignee
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2),
      },
      tags: tagArray,
      progress: 0,
    });

    this.handleClose();
  }
}
