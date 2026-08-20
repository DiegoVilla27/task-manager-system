import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormModalComponent } from './task-form-modal.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskResponse, TaskStatus } from '../interfaces/response';
import { UserResponse } from '../../users/interfaces/response';

describe('TaskFormModalComponent', () => {
  let component: TaskFormModalComponent;
  let fixture: ComponentFixture<TaskFormModalComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser: UserResponse = {
    id: 'user-1',
    name: 'Diego',
    lastname: 'Villa',
    email: 'diego@taskmanager.com',
    countTasks: 1,
    createdAt: '2026-08-20',
  };

  const mockTask: TaskResponse = {
    id: 'task-1',
    title: 'Tarea existente',
    description: 'Descripción existente',
    status: TaskStatus.PENDING,
    user: {
      id: mockUser.id,
      name: mockUser.name,
      lastname: mockUser.lastname,
      email: mockUser.email,
    },
    createdAt: '2026-08-20',
  };

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'createTask',
      'updateTask',
    ]);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    taskServiceSpy.createTask.and.returnValue(of(mockTask));
    taskServiceSpy.updateTask.and.returnValue(of(mockTask));
    userServiceSpy.getUsers.and.returnValue(
      of({
        content: [mockUser],
        totalElements: 1,
        totalPages: 1,
        size: 10,
      }),
    );

    TestBed.configureTestingModule({
      imports: [TaskFormModalComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(TaskFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create in Create mode with empty form', () => {
    expect(component).toBeTruthy();
    expect(component.isEdit()).toBeFalse();
    expect(component.modalTitle()).toBe('Crear Nueva Tarea');
  });

  it('should create in Edit mode when task input is provided', () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();

    expect(component.isEdit()).toBeTrue();
    expect(component.modalTitle()).toContain('Editar Tarea');
    expect(component.form.value.title).toBe('Tarea existente');
  });

  it('should create task on valid create submit', async () => {
    component.form.setValue({
      title: 'Nueva tarea creada',
      description: 'Descripción de prueba',
      userId: 'user-1',
    });

    await component.handleSubmit();

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Nueva tarea creada',
      description: 'Descripción de prueba',
      userId: 'user-1',
    });
  });

  it('should update task on valid edit submit', async () => {
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();

    component.form.patchValue({
      title: 'Tarea actualizada',
      description: 'Descripción actualizada',
    });

    await component.handleSubmit();

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('task-1', {
      title: 'Tarea actualizada',
      description: 'Descripción actualizada',
    });
  });
});
