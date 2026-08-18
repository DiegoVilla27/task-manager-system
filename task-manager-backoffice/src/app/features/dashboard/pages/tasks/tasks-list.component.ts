import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMock } from './models/task.model';
import { TasksHeaderComponent } from './components/tasks-header.component';
import { TasksStatsComponent } from './components/tasks-stats.component';
import { TasksFiltersComponent } from './components/tasks-filters.component';
import { TasksTableComponent } from './components/tasks-table.component';
import { TaskCreateModalComponent } from './components/task-create-modal.component';
import { TaskEditModalComponent } from './components/task-edit-modal.component';
import { TaskDeleteModalComponent } from './components/task-delete-modal.component';

export type { TaskMock } from './models/task.model';

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
  styleUrl: './tasks-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  // Modal states
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TaskMock | null>(null);

  // Filter & Pagination states
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  // Mock static data for visual presentation
  readonly tasks = signal<TaskMock[]>([
    {
      id: 'TSK-001',
      code: 'TM-101',
      title: 'Configurar arquitectura de microservicios Spring Boot',
      description:
        'Implementar gateway y servicio de autenticación JWT centralizado.',
      status: 'IN_PROGRESS',
      assignee: {
        name: 'Diego Villa',
        avatarBg: 'from-indigo-600 to-purple-600',
        initials: 'DV',
      },
      dueDate: '20 Feb 2026',
      progress: 65,
      tags: ['Backend', 'Security', 'Spring'],
    },
    {
      id: 'TSK-002',
      code: 'TM-102',
      title: 'Maquetar Backoffice con Tailwind CSS v4 y OnPush',
      description:
        'Crear vistas de autenticación, administración de usuarios y tareas.',
      status: 'IN_PROGRESS',
      assignee: {
        name: 'Alejandro Morales',
        avatarBg: 'from-cyan-500 to-blue-600',
        initials: 'AM',
      },
      dueDate: '22 Feb 2026',
      progress: 90,
      tags: ['Frontend', 'Angular 19', 'UI'],
    },
    {
      id: 'TSK-003',
      code: 'TM-103',
      title: 'Auditoría de seguridad y penetración OWASP',
      description:
        'Verificar cabeceras CORS, CSRF tokens y cifrado de datos sensibles.',
      status: 'TODO',
      assignee: {
        name: 'Camila Rodriguez',
        avatarBg: 'from-pink-500 to-rose-600',
        initials: 'CR',
      },
      dueDate: '28 Feb 2026',
      progress: 10,
      tags: ['Security', 'Audit'],
    },
    {
      id: 'TSK-004',
      code: 'TM-104',
      title: 'Diseñar pipeline CI/CD con Docker y Husky',
      description:
        'Automatizar pruebas unitarias, linting y generación de imágenes Docker.',
      status: 'COMPLETED',
      assignee: {
        name: 'Sofia Hernandez',
        avatarBg: 'from-amber-500 to-orange-600',
        initials: 'SH',
      },
      dueDate: '16 Feb 2026',
      progress: 100,
      tags: ['DevOps', 'Docker', 'CI/CD'],
    },
    {
      id: 'TSK-005',
      code: 'TM-105',
      title: 'Optimizar índices de base de datos PostgreSQL',
      description:
        'Analizar planes de ejecución y crear índices compuestos para consultas lentas.',
      status: 'TODO',
      assignee: {
        name: 'Carlos Mendoza',
        avatarBg: 'from-slate-600 to-slate-700',
        initials: 'CM',
      },
      dueDate: '05 Mar 2026',
      progress: 0,
      tags: ['Database', 'PostgreSQL'],
    },
  ]);

  // Derived filtered tasks
  readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    return this.tasks().filter((task) => {
      const matchesQuery =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.code.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((t) => t.toLowerCase().includes(query));

      const matchesStatus = !status || task.status === status;

      return matchesQuery && matchesStatus;
    });
  });

  // Modal Handlers
  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  handleCreateTask(taskData: Partial<TaskMock>): void {
    const nextIndex = this.tasks().length + 1;
    const newTask: TaskMock = {
      id: `TSK-00${nextIndex}`,
      code: `TM-10${nextIndex}`,
      title: taskData.title || 'Nueva Tarea',
      description: taskData.description || '',
      status: taskData.status || 'TODO',
      assignee: taskData.assignee || {
        name: 'Diego Villa',
        avatarBg: 'from-indigo-600 to-purple-600',
        initials: 'DV',
      },
      dueDate: taskData.dueDate || '28 Feb 2026',
      progress: taskData.progress || 0,
      tags: taskData.tags || ['Task'],
    };

    this.tasks.update((list) => [newTask, ...list]);
    this.closeCreateModal();
  }

  openEditModal(task: TaskMock): void {
    this.selectedTask.set(task);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedTask.set(null);
  }

  handleSaveTask(updatedTask: TaskMock): void {
    this.tasks.update((list) =>
      list.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
    this.closeEditModal();
  }

  openDeleteModal(task: TaskMock): void {
    this.selectedTask.set(task);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedTask.set(null);
  }

  handleDeleteTask(id: string): void {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
    this.closeDeleteModal();
  }

  // Filter Handlers
  handleSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  handleStatusChange(status: string): void {
    this.statusFilter.set(status);
  }

  handleClearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
  }
}
