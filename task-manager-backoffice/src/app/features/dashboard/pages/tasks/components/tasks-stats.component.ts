import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { StatCardComponent } from '@shared/components/ui';
import { TasksPagination } from '../interfaces/response';

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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksStatsComponent {
  readonly tasks = input.required<TasksPagination | undefined>();

  protected readonly totalCount = computed(() => {
    this.tasks();
    return this.tasks()?.totalElements ?? 0;
  });
}
