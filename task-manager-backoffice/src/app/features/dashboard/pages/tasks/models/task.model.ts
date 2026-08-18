export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface TaskAssignee {
  name: string;
  avatarBg: string;
  initials: string;
}

export interface TaskMock {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: TaskAssignee;
  dueDate: string;
  progress: number;
  tags: string[];
}
