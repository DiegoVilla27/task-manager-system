enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

type TaskStatusType = keyof typeof TaskStatus;

interface TaskUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user: TaskUser;
  createdAt: string;
}

interface Pagination {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

interface TasksResponse extends Pagination {
  content: Task[];
}

export { type TaskStatusType, type Task, type TasksResponse, TaskStatus };
