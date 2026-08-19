import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskFormModalComponent } from './task-form-modal.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';
import { TaskResponse, TaskStatus } from '../interfaces/response';
import { UsersPagination } from '../../users/interfaces/response';

describe('TaskFormModalComponent', () => {
  let component: TaskFormModalComponent;
  let fixture: ComponentFixture<TaskFormModalComponent>;
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
    id: 'tsk-123',
    title: 'Tarea Existente',
    description: 'Descripción de prueba',
    status: TaskStatus.IN_PROGRESS,
    user: mockUser,
    createdAt: '2026-01-01',
  };

  const mockUsersPagination: UsersPagination = {
    content: [
      {
        ...mockUser,
        countTasks: 2,
        createdAt: '2026-01-01',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    taskService = jasmine.createSpyObj('TaskService', [
      'createTask',
      'updateTask',
    ]);
    taskService.createTask.and.returnValue(of(mockTask));
    taskService.updateTask.and.returnValue(of(mockTask));

    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    userService.getUsers.and.returnValue(of(mockUsersPagination));

    await TestBed.configureTestingModule({
      imports: [TaskFormModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: TaskService, useValue: taskService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create in create mode by default', () => {
    expect(component).toBeTruthy();
    expect(component.isEdit()).toBeFalse();
    expect(component.modalTitle()).toBe('Crear Nueva Tarea');
    expect(component.submitButtonLabel()).toBe('Guardar Tarea');
  });

  it('should switch to edit mode when task input is provided', () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();

    expect(component.isEdit()).toBeTrue();
    expect(component.modalTitle()).toContain('Editar Tarea: tsk-123');
    expect(component.submitButtonLabel()).toBe('Guardar Cambios');
    expect(component.form.getRawValue().title).toBe('Tarea Existente');
    expect(component.form.getRawValue().description).toBe(
      'Descripción de prueba',
    );
    expect(component.form.get('userId')?.disabled).toBeTrue();
  });

  it('should emit close event on handleClose', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
    expect(component.form.value.title).toBe('');
  });

  it('should not submit when form is invalid', async () => {
    component.form.reset();
    await component.handleSubmit();
    expect(taskService.createTask).not.toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should submit createTask in create mode', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    component.form.patchValue({
      title: 'Nueva Tarea',
      description: 'Nueva Descripción',
      userId: 'usr-1',
    });

    await component.handleSubmit();
    expect(taskService.createTask).toHaveBeenCalled();
    expect(component.handleClose).toHaveBeenCalled();
  });

  it('should submit updateTask in edit mode', async () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();

    spyOn(component, 'handleClose').and.callThrough();

    component.form.patchValue({
      title: 'Tarea Actualizada',
      description: 'Descripción Actualizada',
    });

    await component.handleSubmit();
    expect(taskService.updateTask).toHaveBeenCalledWith('tsk-123', {
      title: 'Tarea Actualizada',
      description: 'Descripción Actualizada',
    });
    expect(component.handleClose).toHaveBeenCalled();
  });

  it('should return user options correctly', () => {
    const options = component.usersOptions();
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options[0]).toBeDefined();
  });
});
