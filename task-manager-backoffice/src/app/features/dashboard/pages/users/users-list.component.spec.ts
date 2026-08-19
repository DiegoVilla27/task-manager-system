import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UsersListComponent } from './users-list.component';
import { UserResponse } from './interfaces/response';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  const mockUser: UserResponse = {
    id: 'USR-TEST-01',
    name: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    countTasks: 5,
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the users list component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should open and close edit modal', () => {
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();

    component.openEditModal(mockUser);
    expect(component.isEditModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeModal();
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();
  });

  it('should open and close delete modal', () => {
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();

    component.openDeleteModal(mockUser);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();
  });

  it('should trigger exportCsv', () => {
    spyOn(console, 'log');
    component.exportCsv();
    expect(console.log).toHaveBeenCalledWith('Excel...');
  });
});
