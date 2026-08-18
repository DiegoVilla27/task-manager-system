import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TaskMock {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  assignee: {
    name: string;
    avatarBg: string;
    initials: string;
  };
  dueDate: string;
  progress: number;
  tags: string[];
}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  // Visual state flags (pure maquetación)
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedTask = signal<TaskMock | null>(null);

  // Mock static data for visual presentation (sin prioridad ni en revisión)
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

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  openEditModal(task: TaskMock): void {
    this.selectedTask.set(task);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedTask.set(null);
  }

  openDeleteModal(task: TaskMock): void {
    this.selectedTask.set(task);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedTask.set(null);
  }
}
