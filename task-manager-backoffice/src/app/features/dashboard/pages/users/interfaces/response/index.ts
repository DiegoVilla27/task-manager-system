import { Pagination } from '@shared/interfaces';

interface UserResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  countTasks: number;
  createdAt: string;
}

type UserMeResponse = Omit<UserResponse, 'countTasks' | 'createdAt'>;

type UsersPagination = Pagination<UserResponse>;

export { type UserResponse, type UserMeResponse, type UsersPagination };
