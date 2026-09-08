import { httpService } from '@core/http';
import type {
  PageTaskResponse,
  TaskCreateRequest,
  TaskResponse,
  TasksPaginationRequest,
  TaskUpdateRequest,
} from '@task-manager-system/api-types';

const API_TASKS = '/tasks';

const getAllTasksSvc = async (
  payload: TasksPaginationRequest,
): Promise<PageTaskResponse | null> => {
  const response = await httpService.get<PageTaskResponse>(API_TASKS, { ...payload });
  return response;
};

const createTaskSvc = async (payload: TaskCreateRequest): Promise<TaskResponse | null> => {
  const response = await httpService.post<TaskResponse>(API_TASKS, payload);
  return response;
};

const updateTaskSvc = async (
  taskId: string,
  payload: TaskUpdateRequest,
): Promise<TaskResponse | null> => {
  const response = await httpService.patch<TaskResponse>(`${API_TASKS}/${taskId}`, payload);
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
