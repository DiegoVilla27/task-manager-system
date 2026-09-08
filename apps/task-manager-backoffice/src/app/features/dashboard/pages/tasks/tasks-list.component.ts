import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  TaskResponse,
  TasksPaginationRequest,
} from '@task-manager-system/api-types';
import { firstValueFrom } from 'rxjs';
import { TaskDeleteModalComponent } from './components/task-delete-modal.component';
import { TaskFormModalComponent } from './components/task-form-modal.component';
import { TasksFiltersComponent } from './components/tasks-filters.component';
import { TasksHeaderComponent } from './components/tasks-header.component';
import { TasksStatsComponent } from './components/tasks-stats.component';
import { TasksTableComponent } from './components/tasks-table.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    TasksHeaderComponent,
    TasksStatsComponent,
    TasksFiltersComponent,
    TasksTableComponent,
    TaskFormModalComponent,
    TaskDeleteModalComponent,
  ],
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  // Modal states
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TaskResponse | null>(null);

  // Filter & Pagination states
  readonly page = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly search = signal<string>('');
  readonly status = signal<TasksPaginationRequest['filters']['status']>('');

  private readonly tasksSvc = inject(TaskService);

  readonly tasks = injectQuery(() => ({
    queryKey: [
      '/tasks',
      {
        page: this.page(),
        limit: this.limit(),
        search: this.search(),
        status: this.status(),
      },
    ],
    queryFn: () =>
      firstValueFrom(
        this.tasksSvc.getTasks({
          page: this.page(),
          limit: this.limit(),
          filters: {
            search: this.search(),
            status: this.status(),
          },
        }),
      ),
  }));

  openCreateModal(): void {
    this.selectedTask.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(task: TaskResponse): void {
    this.selectedTask.set(task);
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(task: TaskResponse): void {
    this.selectedTask.set(task);
    this.isDeleteModalOpen.set(true);
  }

  handleClearFilters(): void {
    this.search.set('');
    this.status.set('');
  }

  closeModal(): void {
    this.isFormModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedTask.set(null);
  }
}
