import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { environment } from '@environments/environment';
import {
  PageTaskResponse,
  TaskCreateRequest,
  TaskResponse,
  TasksPaginationRequest,
  TaskStatus,
  TaskUpdateRequest,
} from '@task-manager-system/api-types';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTaskResponse: TaskResponse = {
    id: 'task-1',
    title: 'Implement feature',
    description: 'Feature description',
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
    content: [mockTaskResponse],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks with clean params', (done) => {
    const payload: TasksPaginationRequest = {
      page: 1,
      limit: 10,
      filters: {
        search: 'test',
        status: TaskStatus.PENDING,
      },
    };

    service.getTasks(payload).subscribe((res) => {
      expect(res).toEqual(mockTasksPagination);
      done();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${environment.API_URL}/tasks` &&
        r.params.get('page') === '1' &&
        r.params.get('limit') === '10' &&
        r.params.get('search') === 'test' &&
        r.params.get('status') === TaskStatus.PENDING,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTasksPagination);
  });

  it('should create task', (done) => {
    const payload: TaskCreateRequest = {
      title: 'New task',
      description: 'New task description',
      userId: 'user-1',
    };

    service.createTask(payload).subscribe((res) => {
      expect(res).toEqual(mockTaskResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockTaskResponse);
  });

  it('should update task', (done) => {
    const payload: TaskUpdateRequest = {
      title: 'Updated title',
    };

    service.updateTask('task-1', payload).subscribe((res) => {
      expect(res).toEqual(mockTaskResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/tasks/task-1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockTaskResponse);
  });

  it('should delete task', (done) => {
    service.deleteTask('task-1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/tasks/task-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
