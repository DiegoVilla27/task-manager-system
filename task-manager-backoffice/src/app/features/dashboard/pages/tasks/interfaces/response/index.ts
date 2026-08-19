import { UserResponse } from '@features/dashboard/pages/users/interfaces/response';
import { Pagination } from '@shared/interfaces';

const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;
type TaskStatusType = keyof typeof TaskStatus;

interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatusType;
  user: Pick<UserResponse, 'id' | 'name' | 'lastname' | 'email'>;
  createdAt: string;
}

type TasksPagination = Pagination<TaskResponse>;

export {
  type TaskResponse,
  type TasksPagination,
  TaskStatus,
  type TaskStatusType,
};
