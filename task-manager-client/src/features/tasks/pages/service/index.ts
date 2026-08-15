import { httpService } from '@core/http';
import type { TaskCreateRequest, TasksRequest, TaskUpdateRequest } from '../interfaces/request';
import type { Task, TasksResponse } from '../interfaces/response';

const API_TASKS = '/tasks';

const getAllTasksSvc = async (payload: TasksRequest): Promise<TasksResponse | null> => {
  try {
    const response = await httpService.get<TasksResponse>(API_TASKS, {
      page: payload.page,
      limit: payload.limit,
      ...(payload.filters?.search ? { search: payload.filters.search } : {}),
      ...(payload.filters?.status ? { status: payload.filters.status } : {}),
    });
    return response;
  } catch {
    return null;
  }
};

const createTaskSvc = async (payload: TaskCreateRequest): Promise<Task | null> => {
  try {
    const response = await httpService.post<Task>(API_TASKS, payload);
    return response;
  } catch {
    return null;
  }
};

const updateTaskSvc = async (taskId: string, payload: TaskUpdateRequest): Promise<Task | null> => {
  try {
    const response = await httpService.patch<Task>(`${API_TASKS}/${taskId}`, payload);
    return response;
  } catch {
    return null;
  }
};

const deleteTaskSvc = async (taskId: string): Promise<boolean> => {
  try {
    await httpService.delete(`${API_TASKS}/${taskId}`);
    return true;
  } catch {
    return false;
  }
};

const startTaskSvc = async (taskId: string): Promise<boolean> => {
  try {
    await httpService.patch(`${API_TASKS}/${taskId}/start`);
    return true;
  } catch {
    return false;
  }
};

const completeTaskSvc = async (taskId: string): Promise<boolean> => {
  try {
    await httpService.patch(`${API_TASKS}/${taskId}/complete`);
    return true;
  } catch {
    return false;
  }
};

export {
  completeTaskSvc,
  createTaskSvc,
  deleteTaskSvc,
  getAllTasksSvc,
  startTaskSvc,
  updateTaskSvc,
};
