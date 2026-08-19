import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { TaskCreateModalComponent } from './components/task-create-modal.component';
import { TaskDeleteModalComponent } from './components/task-delete-modal.component';
import { TaskEditModalComponent } from './components/task-edit-modal.component';
import { TasksFiltersComponent } from './components/tasks-filters.component';
import { TasksHeaderComponent } from './components/tasks-header.component';
import { TasksStatsComponent } from './components/tasks-stats.component';
import { TasksTableComponent } from './components/tasks-table.component';
import { TaskResponse } from './interfaces/response';
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
    TaskCreateModalComponent,
    TaskEditModalComponent,
    TaskDeleteModalComponent,
  ],
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  // Modal states
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TaskResponse | null>(null);

  // Filter & Pagination states
  readonly page = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly search = signal<string>('');
  readonly status = signal<string>('');

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
          search: this.search(),
          status: this.status(),
        }),
      ),
  }));

  openEditModal(task: TaskResponse): void {
    this.selectedTask.set(task);
    this.isEditModalOpen.set(true);
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
    this.isCreateModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedTask.set(null);
  }
}
