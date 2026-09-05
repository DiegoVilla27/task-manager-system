import { completeTaskSvc, startTaskSvc } from '@features/tasks/services';
import type { DropResult } from '@hello-pangea/dnd';
import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import useKanbanTasks from '.';

vi.mock('@features/tasks/services', () => ({
  startTaskSvc: vi.fn(),
  completeTaskSvc: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Tasks: useKanbanTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing if destination is null', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-1',
      source: { droppableId: 'PENDING', index: 0 },
      destination: null,
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).not.toHaveBeenCalled();
    expect(startTaskSvc).not.toHaveBeenCalled();
    expect(completeTaskSvc).not.toHaveBeenCalled();
  });

  it('should do nothing if destination is the same column as source', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-1',
      source: { droppableId: 'PENDING', index: 0 },
      destination: { droppableId: 'PENDING', index: 1 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).not.toHaveBeenCalled();
    expect(startTaskSvc).not.toHaveBeenCalled();
    expect(completeTaskSvc).not.toHaveBeenCalled();
  });

  it('should advance task from PENDING to IN_PROGRESS successfully', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    vi.mocked(startTaskSvc).mockResolvedValue(true);
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-1',
      source: { droppableId: 'PENDING', index: 0 },
      destination: { droppableId: 'IN_PROGRESS', index: 0 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).toHaveBeenCalledWith('task-1', 'IN_PROGRESS');
    expect(startTaskSvc).toHaveBeenCalledWith('task-1');
    expect(toast.success).toHaveBeenCalledWith('Task started');
  });

  it('should rollback to PENDING when startTaskSvc fails during PENDING to IN_PROGRESS transition', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    vi.mocked(startTaskSvc).mockResolvedValue(false);
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-1',
      source: { droppableId: 'PENDING', index: 0 },
      destination: { droppableId: 'IN_PROGRESS', index: 0 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).toHaveBeenNthCalledWith(1, 'task-1', 'IN_PROGRESS');
    expect(startTaskSvc).toHaveBeenCalledWith('task-1');
    expect(onTaskStatusChange).toHaveBeenNthCalledWith(2, 'task-1', 'PENDING');
    expect(toast.error).toHaveBeenCalledWith('Error al iniciar tarea. Se revirtió el cambio.');
  });

  it('should advance task from IN_PROGRESS to COMPLETED successfully', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    vi.mocked(completeTaskSvc).mockResolvedValue(true);
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-2',
      source: { droppableId: 'IN_PROGRESS', index: 0 },
      destination: { droppableId: 'COMPLETED', index: 0 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).toHaveBeenCalledWith('task-2', 'COMPLETED');
    expect(completeTaskSvc).toHaveBeenCalledWith('task-2');
    expect(toast.success).toHaveBeenCalledWith('Task completed');
  });

  it('should rollback to IN_PROGRESS when completeTaskSvc fails during IN_PROGRESS to COMPLETED transition', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    vi.mocked(completeTaskSvc).mockResolvedValue(false);
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-2',
      source: { droppableId: 'IN_PROGRESS', index: 0 },
      destination: { droppableId: 'COMPLETED', index: 0 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).toHaveBeenNthCalledWith(1, 'task-2', 'COMPLETED');
    expect(completeTaskSvc).toHaveBeenCalledWith('task-2');
    expect(onTaskStatusChange).toHaveBeenNthCalledWith(2, 'task-2', 'IN_PROGRESS');
    expect(toast.error).toHaveBeenCalledWith('Error al completar tarea. Se revirtió el cambio.');
  });

  it('should show error on disallowed transition (e.g. PENDING to COMPLETED or COMPLETED to PENDING)', async () => {
    // Arrange
    const onTaskStatusChange = vi.fn();
    const { result } = renderHook(() => useKanbanTasks({ onTaskStatusChange }));

    const dropResult: DropResult = {
      draggableId: 'task-3',
      source: { droppableId: 'PENDING', index: 0 },
      destination: { droppableId: 'COMPLETED', index: 0 },
      combine: null,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP',
    };

    // Act
    await act(async () => {
      await result.current.handleDragEnd(dropResult);
    });

    // Assert
    expect(onTaskStatusChange).not.toHaveBeenCalled();
    expect(startTaskSvc).not.toHaveBeenCalled();
    expect(completeTaskSvc).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      'Movimiento no permitido. La tarea solo puede avanzar de PENDING a IN_PROGRESS y luego a COMPLETED.',
    );
  });
});
