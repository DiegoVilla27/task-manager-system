import { act, renderHook, waitFor } from '@testing-library/react';
import useTasksPage from '.';
import { getAllTasksSvc } from '@features/tasks/services';
import { TaskStatus, type TasksResponse } from '@features/tasks/interfaces/response';

vi.mock('@features/tasks/services', () => ({
  getAllTasksSvc: vi.fn(),
}));

describe('Tasks: useTasksPage', () => {
  const tasksMocked: TasksResponse = {
    content: [
      {
        id: '123',
        title: 'Task One',
        description: 'Description One',
        status: TaskStatus.PENDING,
        user: {
          id: '123',
          name: 'Diego',
          lastname: 'Villa',
          email: 'dv@gmail.com',
        },
        createdAt: '11/02/2028',
      },
    ],
    empty: false,
    first: true,
    last: false,
    number: 0,
    numberOfElements: 1,
    pageable: {} as any,
    size: 10,
    sort: {} as any,
    totalElements: 2,
    totalPages: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch tasks on mount with default pagination and filters', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
    });

    // Assert
    expect(getAllTasksSvc).toHaveBeenCalledTimes(1);
    expect(getAllTasksSvc).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      filters: { search: '', status: '' },
    });
    expect(result.current.page).toBe(1);
  });

  it('should fetch tasks on mount with default pagination and filters in page two', async () => {
    // Arrange
    const tasksPageTwoMocked = {
      ...tasksMocked,
      number: 1,
      first: false,
      last: true,
    };
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksPageTwoMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    act(() => {
      result.current.setPage(2);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksPageTwoMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(2);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
    expect(result.current.page).toBe(2);
  });

  it('should fetch tasks with status filter', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    act(() => result.current.setStatus('IN_PROGRESS'));

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(2);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: 'IN_PROGRESS' },
      });
    });
    expect(result.current.status).toBe('IN_PROGRESS');
  });

  it('should fetch tasks with search filter', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    act(() => result.current.setSearch('task'));

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(2);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: 'task', status: '' },
      });
    });
    expect(result.current.search).toBe('task');
  });

  it('should delete a task and refetch', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
    });

    act(() => result.current.handleTaskDeleted());

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(2);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
  });

  it('should change task status and refetch', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
    });

    act(() => result.current.handleTaskStatusChange('123', 'IN_PROGRESS'));

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual({
        ...tasksMocked,
        content: [
          {
            ...tasksMocked.content[0],
            status: TaskStatus.IN_PROGRESS,
          },
        ],
      });
      expect(getAllTasksSvc).toHaveBeenCalledTimes(1);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
  });

  it('should not change task status if tasks is empty', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(null);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toBeNull();
    });

    act(() => result.current.handleTaskStatusChange('123', 'IN_PROGRESS'));

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toBeNull();
      expect(getAllTasksSvc).toHaveBeenCalledTimes(1);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
  });

  it('should not change task if doesnt exists', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
    });

    act(() => result.current.handleTaskStatusChange('1234', 'IN_PROGRESS'));

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(1);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
  });

  it('should load more tasks in kanban', async () => {
    // Arrange
    vi.mocked(getAllTasksSvc).mockResolvedValue(tasksMocked);

    // Act
    const { result } = renderHook(() => useTasksPage());
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
    });

    act(() => result.current.handleLoadMore());

    // Assert
    await waitFor(() => {
      expect(result.current.tasks).toEqual(tasksMocked);
      expect(getAllTasksSvc).toHaveBeenCalledTimes(2);
      expect(getAllTasksSvc).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { search: '', status: '' },
      });
    });
  });
});
