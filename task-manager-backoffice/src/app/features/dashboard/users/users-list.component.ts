import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserMock {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'VIEWER';
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  avatarBg: string;
  initials: string;
  assignedTasks: number;
  lastLogin: string;
  createdAt: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  // Visual state flags for pure maquetación modals and UI toggles
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedUser = signal<UserMock | null>(null);

  // Mock static data for visual presentation
  readonly users = signal<UserMock[]>([
    {
      id: 'USR-001',
      name: 'Diego Villa',
      email: 'diego.villa@taskmanager.io',
      role: 'SUPER_ADMIN',
      department: 'Dirección Tecnológica',
      status: 'ACTIVE',
      avatarBg: 'from-indigo-600 to-purple-600',
      initials: 'DV',
      assignedTasks: 14,
      lastLogin: 'Hace 5 minutos',
      createdAt: '12 Ene 2026',
    },
    {
      id: 'USR-002',
      name: 'Camila Rodriguez',
      email: 'camila.r@taskmanager.io',
      role: 'MANAGER',
      department: 'Product Management',
      status: 'ACTIVE',
      avatarBg: 'from-pink-500 to-rose-600',
      initials: 'CR',
      assignedTasks: 9,
      lastLogin: 'Hace 2 horas',
      createdAt: '18 Ene 2026',
    },
    {
      id: 'USR-003',
      name: 'Alejandro Morales',
      email: 'alejandro.m@taskmanager.io',
      role: 'DEVELOPER',
      department: 'Frontend Engineering',
      status: 'ACTIVE',
      avatarBg: 'from-cyan-500 to-blue-600',
      initials: 'AM',
      assignedTasks: 18,
      lastLogin: 'Ayer a las 18:40',
      createdAt: '03 Feb 2026',
    },
    {
      id: 'USR-004',
      name: 'Sofia Hernandez',
      email: 'sofia.h@taskmanager.io',
      role: 'DEVELOPER',
      department: 'Backend Engineering',
      status: 'PENDING',
      avatarBg: 'from-amber-500 to-orange-600',
      initials: 'SH',
      assignedTasks: 4,
      lastLogin: 'Nunca ha ingresado',
      createdAt: '15 Feb 2026',
    },
    {
      id: 'USR-005',
      name: 'Carlos Mendoza',
      email: 'carlos.m@taskmanager.io',
      role: 'VIEWER',
      department: 'Auditoría & QA',
      status: 'INACTIVE',
      avatarBg: 'from-slate-600 to-slate-700',
      initials: 'CM',
      assignedTasks: 0,
      lastLogin: 'Hace 2 semanas',
      createdAt: '20 Ene 2026',
    },
  ]);

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  openEditModal(user: UserMock): void {
    this.selectedUser.set(user);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedUser.set(null);
  }

  openDeleteModal(user: UserMock): void {
    this.selectedUser.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedUser.set(null);
  }
}
