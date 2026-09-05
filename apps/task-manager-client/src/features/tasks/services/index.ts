import { httpService } from '@core/http';
import type { TaskCreateRequest, TasksRequest, TaskUpdateRequest } from '../interfaces/request';
import type { Task, TasksResponse } from '../interfaces/response';

const API_TASKS = '/tasks';

const getAllTasksSvc = async (payload: TasksRequest): Promise<TasksResponse | null> => {
  const response = await httpService.get<TasksResponse>(API_TASKS, {
    page: payload.page,
    limit: payload.limit,
    ...(payload.filters?.search ? { search: payload.filters.search } : {}),
    ...(payload.filters?.status ? { status: payload.filters.status } : {}),
  });
  return response;
};

const createTaskSvc = async (payload: TaskCreateRequest): Promise<Task | null> => {
  const response = await httpService.post<Task>(API_TASKS, payload);
  return response;
};

const updateTaskSvc = async (taskId: string, payload: TaskUpdateRequest): Promise<Task | null> => {
  const response = await httpService.patch<Task>(`${API_TASKS}/${taskId}`, payload);
  return response;
};

const deleteTaskSvc = async (taskId: string): Promise<boolean> => {
  await httpService.delete(`${API_TASKS}/${taskId}`);
  return true;
};

const startTaskSvc = async (taskId: string): Promise<boolean> => {
  await httpService.patch(`${API_TASKS}/${taskId}/start`);
  return true;
};

const completeTaskSvc = async (taskId: string): Promise<boolean> => {
  await httpService.patch(`${API_TASKS}/${taskId}/complete`);
  return true;
};

export {
  completeTaskSvc,
  createTaskSvc,
  deleteTaskSvc,
  getAllTasksSvc,
  startTaskSvc,
  updateTaskSvc,
};
