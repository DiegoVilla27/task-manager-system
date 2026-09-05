import { completeTaskSvc, deleteTaskSvc, startTaskSvc } from '@features/tasks/services';
import useModalStore from '@features/tasks/store/modalStore';
import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import useTableTasks from '.';

vi.mock('@features/tasks/services', () => ({
  startTaskSvc: vi.fn(),
  completeTaskSvc: vi.fn(),
  deleteTaskSvc: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Tasks: useTableTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('handleCopyId', () => {
    it('should copy ID to clipboard and reset copiedId after timeout', () => {
      // Arrange
      const { result } = renderHook(() => useTableTasks());

      // Act
      act(() => {
        result.current.handleCopyId('task-uuid-123');
      });

      // Assert
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('task-uuid-123');
      expect(result.current.copiedId).toBe('task-uuid-123');
      expect(toast.success).toHaveBeenCalledWith('ID copiado al portapapeles');

      // Fast forward 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.copiedId).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('should return "-" when dateString is empty or null', () => {
      const { result } = renderHook(() => useTableTasks());
      expect(result.current.formatDate('')).toBe('-');
    });

    it('should return original string when date is invalid', () => {
      const { result } = renderHook(() => useTableTasks());
      expect(result.current.formatDate('invalid-date')).toBe('invalid-date');
    });

    it('should format valid date correctly as dd/mm/yyyy', () => {
      const { result } = renderHook(() => useTableTasks());
      // 2026-08-16 -> 16/08/2026
      const formatted = result.current.formatDate('2026-08-16T12:00:00Z');
      expect(formatted).toMatch(/\d{2}\/\d{2}\/2026/);
    });
  });

  describe('startTask', () => {
    it('should start task with optimistic update and toast on success', async () => {
      // Arrange
      const onTaskStatusChange = vi.fn();
      vi.mocked(startTaskSvc).mockResolvedValue(true);
      const { result } = renderHook(() => useTableTasks({ onTaskStatusChange }));

      // Act
      await act(async () => {
        await result.current.startTask('task-1');
      });

      // Assert
      expect(onTaskStatusChange).toHaveBeenCalledWith('task-1', 'IN_PROGRESS');
      expect(startTaskSvc).toHaveBeenCalledWith('task-1');
      expect(toast.success).toHaveBeenCalledWith('Task started');
    });

    it('should rollback to PENDING when startTaskSvc fails', async () => {
      // Arrange
      const onTaskStatusChange = vi.fn();
      vi.mocked(startTaskSvc).mockResolvedValue(false);
      const { result } = renderHook(() => useTableTasks({ onTaskStatusChange }));

      // Act
      await act(async () => {
        await result.current.startTask('task-1');
      });

      // Assert
      expect(onTaskStatusChange).toHaveBeenNthCalledWith(1, 'task-1', 'IN_PROGRESS');
      expect(startTaskSvc).toHaveBeenCalledWith('task-1');
      expect(onTaskStatusChange).toHaveBeenNthCalledWith(2, 'task-1', 'PENDING');
      expect(toast.error).toHaveBeenCalledWith('Error al iniciar tarea. Se revirtió el cambio.');
    });
  });

  describe('completeTask', () => {
    it('should complete task with optimistic update and toast on success', async () => {
      // Arrange
      const onTaskStatusChange = vi.fn();
      vi.mocked(completeTaskSvc).mockResolvedValue(true);
      const { result } = renderHook(() => useTableTasks({ onTaskStatusChange }));

      // Act
      await act(async () => {
        await result.current.completeTask('task-2');
      });

      // Assert
      expect(onTaskStatusChange).toHaveBeenCalledWith('task-2', 'COMPLETED');
      expect(completeTaskSvc).toHaveBeenCalledWith('task-2');
      expect(toast.success).toHaveBeenCalledWith('Task completed');
    });

    it('should rollback to IN_PROGRESS when completeTaskSvc fails', async () => {
      // Arrange
      const onTaskStatusChange = vi.fn();
      vi.mocked(completeTaskSvc).mockResolvedValue(false);
      const { result } = renderHook(() => useTableTasks({ onTaskStatusChange }));

      // Act
      await act(async () => {
        await result.current.completeTask('task-2');
      });

      // Assert
      expect(onTaskStatusChange).toHaveBeenNthCalledWith(1, 'task-2', 'COMPLETED');
      expect(completeTaskSvc).toHaveBeenCalledWith('task-2');
      expect(onTaskStatusChange).toHaveBeenNthCalledWith(2, 'task-2', 'IN_PROGRESS');
      expect(toast.error).toHaveBeenCalledWith('Error al completar tarea. Se revirtió el cambio.');
    });
  });

  describe('deleteTask', () => {
    it('should delete task and call onTaskDeleted on success', async () => {
      // Arrange
      const onTaskDeleted = vi.fn();
      vi.mocked(deleteTaskSvc).mockResolvedValue(true);
      const { result } = renderHook(() => useTableTasks({ onTaskDeleted }));

      // Act
      await act(async () => {
        await result.current.deleteTask('task-3');
      });

      // Assert
      expect(deleteTaskSvc).toHaveBeenCalledWith('task-3');
      expect(toast.success).toHaveBeenCalledWith('Task deleted');
      expect(onTaskDeleted).toHaveBeenCalledTimes(1);
    });

    it('should show error toast when deleteTaskSvc fails', async () => {
      // Arrange
      const onTaskDeleted = vi.fn();
      vi.mocked(deleteTaskSvc).mockResolvedValue(false);
      const { result } = renderHook(() => useTableTasks({ onTaskDeleted }));

      // Act
      await act(async () => {
        await result.current.deleteTask('task-3');
      });

      // Assert
      expect(deleteTaskSvc).toHaveBeenCalledWith('task-3');
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar la tarea.');
      expect(onTaskDeleted).not.toHaveBeenCalled();
    });
  });

  describe('openModal', () => {
    it('should expose openModal from modalStore', () => {
      const openModalMock = vi.fn();
      useModalStore.setState({ openModal: openModalMock });

      const { result } = renderHook(() => useTableTasks());
      result.current.openModal();

      expect(openModalMock).toHaveBeenCalledTimes(1);
    });
  });
});
