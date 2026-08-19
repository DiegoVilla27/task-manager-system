import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';
import { TaskResponse, TaskStatus } from '../interfaces/response';
import { UsersPagination } from '../../users/interfaces/response';

describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let userService: jasmine.SpyObj<UserService>;
  let queryClient: QueryClient;

  const mockUser = {
    id: 'usr-1',
    name: 'Diego',
    lastname: 'Villa',
    email: 'diego@example.com',
  };

  const mockTask: TaskResponse = {
    id: 'task-1',
    title: 'Migración a Signals',
    description: 'Refactorizar componentes a Signals',
    status: TaskStatus.IN_PROGRESS,
    user: mockUser,
    createdAt: '2026-01-01',
  };

  const mockUsersPagination: UsersPagination = {
    content: [
      {
        ...mockUser,
        countTasks: 1,
        createdAt: '2026-01-01',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    taskService = jasmine.createSpyObj('TaskService', ['updateTask']);
    taskService.updateTask.and.returnValue(of(mockTask));

    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    userService.getUsers.and.returnValue(of(mockUsersPagination));

    await TestBed.configureTestingModule({
      imports: [TaskEditModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: TaskService, useValue: taskService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with task data', () => {
    expect(component.form.getRawValue().title).toBe('Migración a Signals');
    expect(component.form.getRawValue().description).toBe(
      'Refactorizar componentes a Signals',
    );
    expect(component.form.getRawValue().userId).toBe('usr-1');
  });

  it('should emit close event on handleClose and reset form', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
    expect(component.form.value.title).toBe('');
  });

  it('should not submit if form is invalid or task is null', async () => {
    component.form.get('title')?.setValue('a'); // minLength 3 -> invalid
    await component.handleSubmit();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should submit valid form and trigger editTask mutation', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    component.form.patchValue({
      title: 'Migración a Signals V2',
      description: 'Refactorizar componentes a Signals V2',
    });

    await component.handleSubmit();
    expect(component.handleClose).toHaveBeenCalled();
  });
});
