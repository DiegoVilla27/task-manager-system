import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  TextareaComponent,
} from '@shared/components/ui';
import { TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest,
} from '@task-manager-system/api-types';

@Component({
  selector: 'app-task-form-modal',
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
      [title]="modalTitle()"
      [subtitle]="modalSubtitle()"
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
          forId="task-form-title"
          [required]="true"
        >
          <app-input
            id="task-form-title"
            placeholder="Ej. Implementar integración OAuth2 con Google"
            formControlName="title"
          />
        </app-form-field>

        <!-- Description -->
        <app-form-field
          label="Descripción Detallada"
          forId="task-form-desc"
          [required]="true"
        >
          <app-textarea
            id="task-form-desc"
            [rows]="3"
            placeholder="Detalla los requerimientos, endpoints necesarios o criterios de aceptación..."
            formControlName="description"
          />
        </app-form-field>

        <!-- Assignee -->
        <app-form-field
          label="Usuario Responsable"
          forId="task-form-assignee"
          [required]="true"
        >
          <app-select
            id="task-form-assignee"
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
            {{ submitButtonLabel() }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormModalComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly tasksSvc = inject(TaskService);
  private readonly usersSvc = inject(UserService);
  private readonly queryClient = inject(QueryClient);

  readonly isOpen = input.required<boolean>();
  readonly task = input<TaskResponse | null>(null);
  readonly close = output<void>();

  readonly isEdit = computed(() => !!this.task());

  readonly modalTitle = computed(() =>
    this.isEdit()
      ? `Editar Tarea: ${this.task()?.id ?? ''}`
      : 'Crear Nueva Tarea',
  );

  readonly modalSubtitle = computed(() =>
    this.isEdit()
      ? 'Actualiza la información de la tarea asignada'
      : 'Asigna y planifica una nueva actividad para el equipo',
  );

  readonly submitButtonLabel = computed(() =>
    this.isEdit() ? 'Guardar Cambios' : 'Guardar Tarea',
  );

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
        this.usersSvc.getUsers({
          page: 1,
          limit: 100,
          filters: {
            search: '',
          },
        }),
      ),
  }));

  readonly usersOptions = computed(() => {
    const list = this.users.data()?.content;
    if (list && list.length > 0) {
      return list.map((u) => ({
        label: `${u.name} ${u.lastname}`,
        value: u.id!,
      }));
    }
    const currentAssignee = this.task()?.user;
    if (currentAssignee) {
      return [
        {
          label: `${currentAssignee.name} ${currentAssignee.lastname}`,
          value: currentAssignee.id!,
        },
      ];
    }
    return [{ value: '', label: 'Seleccionar usuario...' }];
  });

  private readonly createTaskMutation = injectMutation(() => ({
    mutationFn: (payload: TaskCreateRequest) =>
      firstValueFrom(this.tasksSvc.createTask(payload)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/tasks'] }),
  }));

  private readonly editTaskMutation = injectMutation(() => ({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: TaskUpdateRequest;
    }) => firstValueFrom(this.tasksSvc.updateTask(taskId, payload)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/tasks'] }),
  }));

  constructor() {
    effect(() => {
      const current = this.task();
      if (current) {
        this.form.patchValue({
          title: current.title,
          description: current.description,
          userId: current.user!.id,
        });
        this.form.get('userId')?.disable();
      } else {
        this.form.get('userId')?.enable();
        this.form.reset({
          title: '',
          description: '',
          userId: '',
        });
      }
    });
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (this.isEdit()) {
      const editPayload: TaskUpdateRequest = {
        title: raw.title,
        description: raw.description,
      };
      await this.editTaskMutation.mutate({
        taskId: this.task()!.id!,
        payload: editPayload,
      });
    } else {
      const createPayload: TaskCreateRequest = {
        title: raw.title,
        description: raw.description,
        userId: raw.userId,
      };
      await this.createTaskMutation.mutate(createPayload);
    }

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
