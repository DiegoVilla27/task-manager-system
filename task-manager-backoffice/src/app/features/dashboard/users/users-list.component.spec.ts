import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent, UserMock } from './users-list.component';

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
});
