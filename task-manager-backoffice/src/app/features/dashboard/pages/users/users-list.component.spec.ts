import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UserMock } from './models/user.model';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  const mockUser: UserMock = {
    id: 'USR-TEST-01',
    name: 'Test User',
    email: 'test@example.com',
    role: 'ADMIN',
    department: 'Engineering',
    status: 'ACTIVE',
    avatarBg: 'from-blue-500 to-indigo-600',
    initials: 'TU',
    assignedTasks: 5,
    lastLogin: 'Hace 1 hora',
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the users list component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial mock users', () => {
    expect(component.users().length).toBeGreaterThan(0);
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should open and close edit modal', () => {
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();

    component.openEditModal(mockUser);
    expect(component.isEditModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeEditModal();
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();
  });

  it('should open and close delete modal', () => {
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();

    component.openDeleteModal(mockUser);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeDeleteModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();
  });

  it('should handle creating a new user', () => {
    const initialCount = component.users().length;
    component.openCreateModal();
    component.handleCreateUser({
      name: 'Nuevo Usuario Test',
      email: 'nuevo@taskmanager.io',
      role: 'DEVELOPER',
      department: 'Mobile App',
      status: 'ACTIVE',
    });

    expect(component.users().length).toBe(initialCount + 1);
    expect(component.users()[0].name).toBe('Nuevo Usuario Test');
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should handle saving an edited user', () => {
    const userToEdit = component.users()[0];
    component.openEditModal(userToEdit);

    const updated: UserMock = {
      ...userToEdit,
      name: 'Nombre Actualizado Test',
      department: 'Core Architecture',
    };

    component.handleSaveUser(updated);
    expect(component.users()[0].name).toBe('Nombre Actualizado Test');
    expect(component.users()[0].department).toBe('Core Architecture');
    expect(component.isEditModalOpen()).toBeFalse();
  });

  it('should handle deleting a user', () => {
    const userToDelete = component.users()[0];
    const initialCount = component.users().length;
    component.openDeleteModal(userToDelete);

    component.handleDeleteUser(userToDelete.id);
    expect(component.users().length).toBe(initialCount - 1);
    expect(
      component.users().find((u) => u.id === userToDelete.id),
    ).toBeUndefined();
    expect(component.isDeleteModalOpen()).toBeFalse();
  });

  it('should filter users by search query', () => {
    component.handleSearchChange('Diego');
    const filtered = component.filteredUsers();
    expect(
      filtered.every(
        (u) =>
          u.name.toLowerCase().includes('diego') ||
          u.email.toLowerCase().includes('diego'),
      ),
    ).toBeTrue();
  });

  it('should filter users by role and status', () => {
    component.handleRoleChange('DEVELOPER');
    component.handleStatusChange('ACTIVE');
    const filtered = component.filteredUsers();
    expect(
      filtered.every((u) => u.role === 'DEVELOPER' && u.status === 'ACTIVE'),
    ).toBeTrue();
  });

  it('should clear all filters', () => {
    component.handleSearchChange('Query');
    component.handleRoleChange('ADMIN');
    component.handleStatusChange('INACTIVE');

    component.handleClearFilters();
    expect(component.searchQuery()).toBe('');
    expect(component.roleFilter()).toBe('');
    expect(component.statusFilter()).toBe('');
  });

  it('should change page on handlePageChange', () => {
    component.handlePageChange(2);
    expect(component.currentPage()).toBe(2);
  });

  it('should trigger exportCsv', () => {
    spyOn(console, 'log');
    component.exportCsv();
    expect(console.log).toHaveBeenCalledWith('Exporting users CSV...');
  });
});
