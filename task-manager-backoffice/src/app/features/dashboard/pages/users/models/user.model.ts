export type UserRole =
  'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface UserMock {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  avatarBg: string;
  initials: string;
  assignedTasks: number;
  lastLogin: string;
  createdAt: string;
}
