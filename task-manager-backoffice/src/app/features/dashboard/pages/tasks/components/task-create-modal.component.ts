import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  TextareaComponent,
} from '@shared/components/ui';
import { CreateTaskRequest } from '../interfaces/request';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { TaskService } from '../services/task.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../users/services/user.service';

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
      (closed)="handleClose()"
    >
      <form
        [formGroup]="form"
        (ngSubmit)="handleSubmit()"
        class="space-y-4 flex flex-col gap-4"
      >
        <!-- Title -->
        <app-form-field
          label="Título de la Tarea"
          forId="create-task-title"
          [required]="true"
        >
          <app-input
            id="create-task-title"
            placeholder="Ej. Implementar integración OAuth2 con Google"
            formControlName="title"
          />
        </app-form-field>

        <!-- Description -->
        <app-form-field
          label="Descripción Detallada"
          forId="create-task-desc"
          [required]="true"
        >
          <app-textarea
            id="create-task-desc"
            [rows]="3"
            placeholder="Detalla los requerimientos, endpoints necesarios o criterios de aceptación..."
            formControlName="description"
          />
        </app-form-field>

        <app-form-field
          label="Asignar usuario"
          forId="create-task-desc"
          [required]="true"
        >
          <app-select
            id="create-task-assignee"
            [options]="usersOptions()"
            formControlName="userId"
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
  private readonly tasksSvc = inject(TaskService);
  private readonly usersSvc = inject(UserService);
  private readonly queryClient = inject(QueryClient);

  readonly isOpen = input.required<boolean>();
  readonly close = output<void>();

  readonly form: FormGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(400)],
    ],
    userId: ['', [Validators.required]],
  });

  private readonly users = injectQuery(() => ({
    queryKey: ['/users'],
    queryFn: () =>
      firstValueFrom(
        this.usersSvc.getUsers({ page: 1, limit: 100, search: '' }),
      ),
  }));

  readonly usersOptions = computed(() => {
    this.users.data();
    return (
      this.users.data()?.content.map((u) => ({
        label: `${u.name} ${u.lastname}`,
        value: u.id,
      })) ?? [{ value: '', label: '' }]
    );
  });

  private readonly createTaskMutation = injectMutation(() => ({
    mutationFn: (payload: CreateTaskRequest) =>
      firstValueFrom(this.tasksSvc.createTask(payload)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/tasks'] }),
  }));

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as CreateTaskRequest;
    await this.createTaskMutation.mutate(payload);

    this.handleClose();
  }

  handleClose(): void {
    this.form.reset({
      title: '',
      description: '',
      userId: '',
    });
    this.close.emit();
  }
}
