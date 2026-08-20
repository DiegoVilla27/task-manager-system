import { UserResponse } from '../response';

interface UsersPaginationRequest {
  page: number;
  limit: number;
  search: string;
}

type CreateUserRequest = Pick<UserResponse, 'name' | 'lastname' | 'email'> & {
  password: string;
};
type EditUserRequest = Partial<CreateUserRequest>;

export {
  type UsersPaginationRequest,
  type CreateUserRequest,
  type EditUserRequest,
};
