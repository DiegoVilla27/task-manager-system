import { TaskResponse, TaskStatusType } from '../response';

interface TasksPaginationRequest {
  page: number;
  limit: number;
  search: string;
  status: TaskStatusType | string;
}

type CreateTaskRequest = Pick<TaskResponse, 'title' | 'description'> & {
  userId?: string;
};
type EditTaskRequest = Partial<CreateTaskRequest>;

export {
  type TasksPaginationRequest,
  type CreateTaskRequest,
  type EditTaskRequest,
};
