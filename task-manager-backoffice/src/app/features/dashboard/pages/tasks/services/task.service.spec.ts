import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { TaskService } from './task.service';
import {
  CreateTaskRequest,
  EditTaskRequest,
  TasksPaginationRequest,
} from '../interfaces/request';
import {
  TaskResponse,
  TasksPagination,
  TaskStatus,
} from '../interfaces/response';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;
  const BASE_TASKS = `${environment.API_URL}/tasks`;

  const mockTask: TaskResponse = {
    id: 'tsk-123',
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

  const mockPagination: TasksPagination = {
    content: [mockTask],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks with pagination and filters', () => {
    const requestPayload: TasksPaginationRequest = {
      page: 1,
      limit: 10,
      search: 'Tarea',
      status: TaskStatus.PENDING,
    };

    service.getTasks(requestPayload).subscribe((res) => {
      expect(res).toEqual(mockPagination);
    });

    const req = httpTestingController.expectOne((r) => r.url === BASE_TASKS);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('search')).toBe('Tarea');
    expect(req.request.params.get('status')).toBe(TaskStatus.PENDING);
    req.flush(mockPagination);
  });

  it('should create a task', () => {
    const payload: CreateTaskRequest = {
      title: 'Nueva Tarea',
      description: 'Descripción de prueba',
      userId: 'usr-1',
    };

    service.createTask(payload).subscribe((res) => {
      expect(res).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(BASE_TASKS);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockTask);
  });

  it('should update a task', () => {
    const taskId = 'tsk-123';
    const payload: EditTaskRequest = {
      title: 'Tarea Modificada',
    };

    const updatedTask: TaskResponse = {
      ...mockTask,
      title: 'Tarea Modificada',
    };

    service.updateTask(taskId, payload).subscribe((res) => {
      expect(res).toEqual(updatedTask);
    });

    const req = httpTestingController.expectOne(`${BASE_TASKS}/${taskId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    const taskId = 'tsk-123';

    service.deleteTask(taskId).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpTestingController.expectOne(`${BASE_TASKS}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
