interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  countTasks: number;
  createdAt: string;
}

type UserMeResponse = Omit<User, 'countTasks' | 'createdAt'>;

export type { User, UserMeResponse };
