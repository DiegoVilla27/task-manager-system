import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ModalComponent } from '@shared/components/ui';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { TaskService } from '../services/task.service';
import { firstValueFrom } from 'rxjs';
import { TaskResponse } from '@task-manager-system/api-types';

@Component({
  selector: 'app-task-delete-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Eliminar Tarea"
      size="md"
      (closed)="handleClose()"
    >
      @if (task()) {
        <div class="space-y-4">
          <div
            class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div class="text-center">
            <p class="text-sm font-semibold text-white">
              ¿Estás seguro de eliminar la tarea?
            </p>
            <p class="text-xs text-slate-400 mt-1">
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              tarea
              <strong class="text-slate-200">"{{ task()?.title }}"</strong> ({{
                task()?.id
              }}).
            </p>
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

            <app-button
              type="button"
              variant="danger"
              size="md"
              (clicked)="handleConfirm()"
            >
              Sí, Eliminar
            </app-button>
          </div>
        </div>
      }
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDeleteModalComponent {
  private readonly tasksSvc = inject(TaskService);
  private readonly queryClient = inject(QueryClient);
  readonly isOpen = input.required<boolean>();
  readonly task = input<TaskResponse | null>(null);
  readonly close = output<void>();

  readonly deleteTaskConfirm = injectMutation(() => ({
    mutationFn: (taskId: string) =>
      firstValueFrom(this.tasksSvc.deleteTask(taskId)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/tasks'] }),
  }));

  handleClose(): void {
    this.close.emit();
  }

  async handleConfirm(): Promise<void> {
    await this.deleteTaskConfirm.mutate(this.task()!.id!);
    this.handleClose();
  }
}
