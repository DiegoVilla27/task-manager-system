import { httpService } from '@core/http';
import {
  completeTaskSvc,
  createTaskSvc,
  deleteTaskSvc,
  getAllTasksSvc,
  startTaskSvc,
  updateTaskSvc,
} from '.';
import type { TaskCreateRequest, TasksRequest, TaskUpdateRequest } from '../interfaces/request';
import { TaskStatus, type Task, type TasksResponse } from '../interfaces/response';

vi.mock('@core/http', () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Tasks: Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all tasks with page and limit', async () => {
    // Arrange
    const payload: TasksRequest = {
      page: 1,
      limit: 10,
    };
    const tasks: TasksResponse = {
      content: [
        {
          id: '123',
          title: 'Task One',
          description: 'Description One',
          status: TaskStatus.PENDING,
          user: {
            id: '123',
            name: 'Diego',
            lastname: 'Villa',
            email: 'dv@gmail.com',
          },
          createdAt: '11/02/2028',
        },
      ],
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 0,
        paged: true,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        unpaged: true,
      },
      size: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      totalElements: 0,
      totalPages: 0,
    };
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(tasks));
    // Act
    const res = await getAllTasksSvc(payload);
    // Assert
    expect(res).toEqual(tasks);
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(httpService.get).toHaveBeenCalledWith('/tasks', payload);
  });

  it('should get all tasks with filters', async () => {
    // Arrange
    const payload: TasksRequest = {
      page: 1,
      limit: 10,
      filters: {
        search: 'diego',
        status: 'PENDING',
      },
    };
    const tasks: TasksResponse = {
      content: [
        {
          id: '123',
          title: 'Task One',
          description: 'Description One',
          status: TaskStatus.PENDING,
          user: {
            id: '123',
            name: 'Diego',
            lastname: 'Villa',
            email: 'dv@gmail.com',
          },
          createdAt: '11/02/2028',
        },
      ],
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 0,
        paged: true,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        unpaged: true,
      },
      size: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      totalElements: 0,
      totalPages: 0,
    };
    vi.mocked(httpService.get).mockReturnValue(Promise.resolve(tasks));
    // Act
    const res = await getAllTasksSvc(payload);
    // Assert
    expect(res).toEqual(tasks);
    expect(httpService.get).toHaveBeenCalledTimes(1);
    expect(httpService.get).toHaveBeenCalledWith('/tasks', {
      page: payload.page,
      limit: payload.limit,
      search: payload.filters!.search,
      status: payload.filters!.status,
    });
  });

  it('should create a task', async () => {
    // Arrange
    const payload: TaskCreateRequest = {
      title: 'Create Task',
      description: 'Description Task',
      userId: '123',
    };
    const task: Task = {
      id: '456',
      title: payload.title,
      description: payload.description,
      status: TaskStatus.PENDING,
      user: {
        id: payload.userId,
        name: 'Diego',
        lastname: 'Villa',
        email: 'dv@gmail.com',
      },
      createdAt: '11/02/2028',
    };
    vi.mocked(httpService.post).mockReturnValue(Promise.resolve(task));
    // Act
    const res = await createTaskSvc(payload);
    // Assert
    expect(res).toEqual(task);
    expect(httpService.post).toHaveBeenCalledTimes(1);
    expect(httpService.post).toHaveBeenCalledWith('/tasks', payload);
  });

  it('should update task', async () => {
    // Arrange
    const taskId: string = '123';
    const payload: TaskUpdateRequest = {
      title: 'Update task',
      description: 'Udate description task',
    };
    const task: Task = {
      id: taskId,
      title: payload.title!,
      description: payload.description!,
      status: TaskStatus.PENDING,
      user: {
        id: '123',
        name: 'Diego',
        lastname: 'Villa',
        email: 'dv@gmail.com',
      },
      createdAt: '11/02/2028',
    };
    vi.mocked(httpService.patch).mockReturnValue(Promise.resolve(task));
    // Act
    const res = await updateTaskSvc(taskId, payload);
    // Assert
    expect(res).toEqual(task);
    expect(httpService.patch).toHaveBeenCalledTimes(1);
    expect(httpService.patch).toHaveBeenCalledWith(`/tasks/${taskId}`, payload);
  });

  it('should delete task', async () => {
    // Arrange
    const taskId: string = '123';
    vi.mocked(httpService.delete).mockReturnValue(Promise.resolve(true));
    // Act
    const res = await deleteTaskSvc(taskId);
    // Assert
    expect(res).toBeTruthy();
    expect(httpService.delete).toHaveBeenCalledTimes(1);
    expect(httpService.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
  });

  it('should start a task', async () => {
    // Arrange
    const taskId: string = '123';
    vi.mocked(httpService.patch).mockReturnValue(Promise.resolve(true));
    // Act
    const res = await startTaskSvc(taskId);
    // Assert
    expect(res).toBeTruthy();
    expect(httpService.patch).toHaveBeenCalledTimes(1);
    expect(httpService.patch).toHaveBeenCalledWith(`/tasks/${taskId}/start`);
  });

  it('should complete a task', async () => {
    // Arrange
    const taskId: string = '123';
    vi.mocked(httpService.patch).mockReturnValue(Promise.resolve(true));
    // Act
    const res = await completeTaskSvc(taskId);
    // Assert
    expect(res).toBeTruthy();
    expect(httpService.patch).toHaveBeenCalledTimes(1);
    expect(httpService.patch).toHaveBeenCalledWith(`/tasks/${taskId}/complete`);
  });
});
