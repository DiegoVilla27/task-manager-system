import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';
import { TaskService } from './services/task.service';
import { UserService } from '../users/services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import {
  PageTaskResponse,
  TaskResponse,
  TaskStatus,
} from '@task-manager-system/api-types';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockTask: TaskResponse = {
    id: 'task-1',
    title: 'Tarea 1',
    description: 'Descripción',
    status: TaskStatus.PENDING,
    user: {
      id: 'user-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@taskmanager.com',
    },
    createdAt: '2026-08-20',
  };

  const mockTasksPagination: PageTaskResponse = {
    content: [mockTask],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    taskServiceSpy.getTasks.and.returnValue(of(mockTasksPagination));
    userServiceSpy.getUsers.and.returnValue(
      of({
        content: [
          {
            id: 'user-1',
            name: 'Diego',
            lastname: 'Villa',
            email: 'diego@taskmanager.com',
            countTasks: 1,
            createdAt: '2026-08-20',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
      }),
    );

    TestBed.configureTestingModule({
      imports: [TasksListComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and load tasks query', () => {
    expect(component).toBeTruthy();
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
  });

  it('should open create modal, edit modal, delete modal and close them', () => {
    component.openCreateModal();
    expect(component.isFormModalOpen()).toBeTrue();
    expect(component.selectedTask()).toBeNull();

    component.closeModal();
    expect(component.isFormModalOpen()).toBeFalse();

    component.openEditModal(mockTask);
    expect(component.isFormModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeModal();
    expect(component.isFormModalOpen()).toBeFalse();

    component.openDeleteModal(mockTask);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
  });

  it('should clear filters with handleClearFilters', () => {
    component.search.set('busqueda');
    component.status.set(TaskStatus.COMPLETED);

    component.handleClearFilters();

    expect(component.search()).toBe('');
    expect(component.status()).toBe('');
  });
});
