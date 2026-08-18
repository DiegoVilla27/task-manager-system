interface UserResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  countTasks: number;
  createdAt: string;
}

type UserMeResponse = Omit<UserResponse, 'countTasks' | 'createdAt'>;

export { type UserResponse, type UserMeResponse };
