import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UserService } from './services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserResponse, UsersPagination } from './interfaces/response';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser: UserResponse = {
    id: 'user-1',
    name: 'Diego',
    lastname: 'Villa',
    email: 'diego@taskmanager.com',
    countTasks: 2,
    createdAt: '2026-08-20',
  };

  const mockUsersPagination: UsersPagination = {
    content: [mockUser],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'createUser',
      'updateUser',
      'deleteUser',
    ]);
    userServiceSpy.getUsers.and.returnValue(of(mockUsersPagination));

    TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and load users query', () => {
    expect(component).toBeTruthy();
    expect(userServiceSpy.getUsers).toHaveBeenCalled();
  });

  it('should open and close modals', () => {
    component.openEditModal(mockUser);
    expect(component.isEditModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeModal();
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedUser()).toBeNull();

    component.openDeleteModal(mockUser);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedUser()).toEqual(mockUser);

    component.closeModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
  });
});
