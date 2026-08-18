import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '@shared/components/ui';
import { TaskMock } from '../models/task.model';

@Component({
  selector: 'app-tasks-stats',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <app-stat-card
        title="Total Tareas"
        [value]="totalCount()"
        subtitle="Registradas en el backoffice"
      />

      <app-stat-card
        title="Por Hacer"
        [value]="todoCount()"
        subtitle="Pendientes de inicio"
        dotColor="bg-slate-400"
        valueColor="text-slate-200"
      />

      <app-stat-card
        title="En Progreso"
        [value]="inProgressCount()"
        subtitle="En desarrollo activo"
        dotColor="bg-indigo-500"
        [dotPulse]="true"
        valueColor="text-indigo-300"
      />

      <app-stat-card
        title="Completadas"
        [value]="completedCount()"
        subtitle="Finalizadas con éxito"
        dotColor="bg-emerald-400"
        valueColor="text-emerald-300"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksStatsComponent {
  readonly tasks = input.required<TaskMock[]>();
  readonly totalRegistered = input<number>(38);

  protected readonly totalCount = computed(() => this.totalRegistered());

  protected readonly todoCount = computed(() => {
    return this.tasks().filter((t) => t.status === 'TODO').length || 16;
  });

  protected readonly inProgressCount = computed(() => {
    return this.tasks().filter((t) => t.status === 'IN_PROGRESS').length || 15;
  });

  protected readonly completedCount = computed(() => {
    return this.tasks().filter((t) => t.status === 'COMPLETED').length || 7;
  });
}
