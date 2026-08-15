interface TasksRequest {
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    status?: string;
  };
}

interface TaskCreateRequest {
  title: string;
  description: string;
  userId: string;
}

interface TaskUpdateRequest {
  title?: string;
  description?: string;
}

export type { TasksRequest, TaskCreateRequest, TaskUpdateRequest };
