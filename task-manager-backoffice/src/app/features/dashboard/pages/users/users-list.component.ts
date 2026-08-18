import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMock } from './models/user.model';
import { UsersHeaderComponent } from './components/users-header.component';
import { UsersStatsComponent } from './components/users-stats.component';
import { UsersFiltersComponent } from './components/users-filters.component';
import { UsersTableComponent } from './components/users-table.component';
import { UserCreateModalComponent } from './components/user-create-modal.component';
import { UserEditModalComponent } from './components/user-edit-modal.component';
import { UserDeleteModalComponent } from './components/user-delete-modal.component';

export type { UserMock } from './models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    UsersHeaderComponent,
    UsersStatsComponent,
    UsersFiltersComponent,
    UsersTableComponent,
    UserCreateModalComponent,
    UserEditModalComponent,
    UserDeleteModalComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  // Modal state flags
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedUser = signal<UserMock | null>(null);

  // Filter & Pagination states
  readonly searchQuery = signal<string>('');
  readonly roleFilter = signal<string>('');
  readonly statusFilter = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

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

  // Derived filtered list
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.roleFilter();
    const status = this.statusFilter();

    return this.users().filter((user) => {
      const matchesQuery =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;

      return matchesQuery && matchesRole && matchesStatus;
    });
  });

  // Modal Handlers
  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  handleCreateUser(userData: Partial<UserMock>): void {
    const nextIndex = this.users().length + 1;
    const newUser: UserMock = {
      id: `USR-00${nextIndex}`,
      name: userData.name || 'Nuevo Usuario',
      email: userData.email || '',
      role: userData.role || 'DEVELOPER',
      department: userData.department || 'General',
      status: userData.status || 'ACTIVE',
      avatarBg: userData.avatarBg || 'from-cyan-500 to-blue-600',
      initials: userData.initials || 'NU',
      assignedTasks: 0,
      lastLogin: 'Nunca',
      createdAt: 'Hoy',
    };

    this.users.update((list) => [newUser, ...list]);
    this.closeCreateModal();
  }

  openEditModal(user: UserMock): void {
    this.selectedUser.set(user);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedUser.set(null);
  }

  handleSaveUser(updatedUser: UserMock): void {
    this.users.update((list) =>
      list.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    this.closeEditModal();
  }

  openDeleteModal(user: UserMock): void {
    this.selectedUser.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedUser.set(null);
  }

  handleDeleteUser(id: string): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
    this.closeDeleteModal();
  }

  // Filter Handlers
  handleSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  handleRoleChange(role: string): void {
    this.roleFilter.set(role);
  }

  handleStatusChange(status: string): void {
    this.statusFilter.set(status);
  }

  handleClearFilters(): void {
    this.searchQuery.set('');
    this.roleFilter.set('');
    this.statusFilter.set('');
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
  }

  exportCsv(): void {
    console.log('Exporting users CSV...');
  }
}
