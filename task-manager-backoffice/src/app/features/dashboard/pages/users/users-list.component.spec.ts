import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UsersListComponent } from './users-list.component';
import { UserResponse, UsersPagination } from './interfaces/response';
import { UserService } from './services/user.service';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUser: UserResponse = {
    id: 'USR-TEST-01',
    name: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    countTasks: 5,
    createdAt: '2026-01-01',
  };

  const mockPagination: UsersPagination = {
    content: [mockUser],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    userService.getUsers.and.returnValue(of(mockPagination));

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
        { provide: UserService, useValue: userService },
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
    component.isCreateModalOpen.set(true);
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
});
