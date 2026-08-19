import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { UserCreateModalComponent } from './components/user-create-modal.component';
import { UserDeleteModalComponent } from './components/user-delete-modal.component';
import { UserEditModalComponent } from './components/user-edit-modal.component';
import { UsersFiltersComponent } from './components/users-filters.component';
import { UsersHeaderComponent } from './components/users-header.component';
import { UsersTableComponent } from './components/users-table.component';
import { UserService } from './services/user.service';
import { UserResponse } from './interfaces/response';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    UsersHeaderComponent,
    UsersFiltersComponent,
    UsersTableComponent,
    UserCreateModalComponent,
    UserEditModalComponent,
    UserDeleteModalComponent,
  ],
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  // Modal state flags
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly selectedUser = signal<UserResponse | null>(null);

  // Filter & Pagination states
  readonly page = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly search = signal<string>('');

  private readonly usersSvc = inject(UserService);

  readonly users = injectQuery(() => ({
    queryKey: [
      '/users',
      {
        page: this.page(),
        limit: this.limit(),
        search: this.search(),
      },
    ],
    queryFn: () =>
      firstValueFrom(
        this.usersSvc.getUsers({
          page: this.page(),
          limit: this.limit(),
          search: this.search(),
        }),
      ),
  }));

  openEditModal(user: UserResponse): void {
    this.selectedUser.set(user);
    this.isEditModalOpen.set(true);
  }

  openDeleteModal(user: UserResponse): void {
    this.selectedUser.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeModal(): void {
    this.isCreateModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedUser.set(null);
  }
}
