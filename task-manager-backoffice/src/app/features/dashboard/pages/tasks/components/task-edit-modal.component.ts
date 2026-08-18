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
  TextareaComponent,
} from '@shared/components/ui';
import { TaskMock } from '../models/task.model';

@Component({
  selector: 'app-task-edit-modal',
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
      [title]="'Editar Tarea: ' + (task()?.code || '')"
      subtitle="Actualiza el estado, avance y asignación de la tarea"
      size="xl"
      (closed)="handleClose()"
    >
      @if (task()) {
        <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
          <!-- Title -->
          <app-form-field
            label="Título de la Tarea"
            forId="edit-task-title"
            [required]="true"
            [error]="titleError()"
          >
            <app-input
              id="edit-task-title"
              formControlName="title"
              [error]="!!titleError()"
            />
          </app-form-field>

          <!-- Description -->
          <app-form-field
            label="Descripción Detallada"
            forId="edit-task-desc"
            [required]="true"
          >
            <app-textarea
              id="edit-task-desc"
              [rows]="3"
              formControlName="description"
            />
          </app-form-field>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Status -->
            <app-form-field label="Estado" forId="edit-task-status">
              <app-select
                id="edit-task-status"
                [options]="statusOptions"
                formControlName="status"
              />
            </app-form-field>

            <!-- Progress % -->
            <app-form-field
              label="Porcentaje de Avance (0 - 100)"
              forId="edit-task-progress"
            >
              <app-input
                id="edit-task-progress"
                type="number"
                formControlName="progress"
              />
            </app-form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Assignee -->
            <app-form-field label="Asignado a" forId="edit-task-assignee">
              <app-select
                id="edit-task-assignee"
                [options]="assigneeOptions"
                formControlName="assignee"
              />
            </app-form-field>

            <!-- Due Date -->
            <app-form-field label="Fecha Límite" forId="edit-task-due">
              <app-input
                id="edit-task-due"
                type="text"
                formControlName="dueDate"
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
export class TaskEditModalComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly isOpen = input.required<boolean>();
  readonly task = input<TaskMock | null>(null);

  readonly closed = output<void>();
  readonly saved = output<TaskMock>();

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
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    status: ['TODO'],
    progress: [0],
    assignee: ['Diego Villa'],
    dueDate: [''],
  });

  constructor() {
    effect(() => {
      const current = this.task();
      if (current) {
        this.form.patchValue({
          title: current.title,
          description: current.description,
          status: current.status,
          progress: current.progress,
          assignee: current.assignee.name,
          dueDate: current.dueDate,
        });
      }
    });
  }

  protected titleError(): string | null {
    const ctrl = this.form.get('title');
    if (ctrl?.touched && ctrl?.invalid) {
      return 'El título es obligatorio';
    }
    return null;
  }

  handleClose(): void {
    this.closed.emit();
  }

  handleSubmit(): void {
    if (this.form.invalid || !this.task()) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const current = this.task()!;

    this.saved.emit({
      ...current,
      title: val.title,
      description: val.description,
      status: val.status,
      progress: Number(val.progress),
      dueDate: val.dueDate,
      assignee: {
        ...current.assignee,
        name: val.assignee,
      },
    });

    this.handleClose();
  }
}
