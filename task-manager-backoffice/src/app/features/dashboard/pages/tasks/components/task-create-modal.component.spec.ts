import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskCreateModalComponent } from './task-create-modal.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';
import { TaskResponse, TaskStatus } from '../interfaces/response';
import { UsersPagination } from '../../users/interfaces/response';

describe('TaskCreateModalComponent', () => {
  let component: TaskCreateModalComponent;
  let fixture: ComponentFixture<TaskCreateModalComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let userService: jasmine.SpyObj<UserService>;
  let queryClient: QueryClient;

  const mockUsersPagination: UsersPagination = {
    content: [
      {
        id: 'usr-1',
        name: 'Diego',
        lastname: 'Villa',
        email: 'diego@example.com',
        countTasks: 0,
        createdAt: '2026-01-01',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  const mockTaskResponse: TaskResponse = {
    id: 'tsk-1',
    title: 'Nueva Tarea',
    description: 'Descripción de prueba',
    status: TaskStatus.PENDING,
    user: {
      id: 'usr-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@example.com',
    },
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    taskService = jasmine.createSpyObj('TaskService', ['createTask']);
    taskService.createTask.and.returnValue(of(mockTaskResponse));

    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    userService.getUsers.and.returnValue(of(mockUsersPagination));

    await TestBed.configureTestingModule({
      imports: [TaskCreateModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: TaskService, useValue: taskService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute user options correctly', () => {
    const options = component.usersOptions();
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options[0]).toBeDefined();
  });

  it('should emit close event on handleClose and reset form', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.form.patchValue({
      title: 'Temp Title',
      description: 'Temp Desc',
      userId: 'usr-1',
    });

    component.handleClose();
    expect(closed).toBeTrue();
    expect(component.form.value.title).toBe('');
  });

  it('should not submit if form is invalid', async () => {
    component.form.reset();
    await component.handleSubmit();
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it('should submit valid form and trigger createTask mutation', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    component.form.patchValue({
      title: 'Valid Task Title',
      description: 'Valid Task Description',
      userId: 'usr-1',
    });

    await component.handleSubmit();
    expect(component.handleClose).toHaveBeenCalled();
  });
});
