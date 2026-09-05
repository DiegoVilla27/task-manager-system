import type { Task, TaskStatusType } from '@features/tasks/interfaces/response';
import { TaskStatus } from '@features/tasks/interfaces/response';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnDraggable from '.';
import useTableTasks from '../../../table/hooks';

vi.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        innerRef: vi.fn(),
        draggableProps: { 'data-testid': 'draggable-wrapper' },
        dragHandleProps: { 'data-testid': 'drag-handle' },
      },
      { isDragging: false },
    ),
}));

vi.mock('../../../table/hooks', () => ({
  default: vi.fn(),
}));

describe('Tasks: ColumnDraggable', () => {
  const mockTask: Task = {
    id: 'task-123',
    title: 'Design Wireframes',
    description: 'Create initial design drafts',
    status: TaskStatus.PENDING,
    user: {
      id: 'u-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'dv@example.com',
    },
    createdAt: '2026-08-16T12:00:00Z',
  };

  const defaultMockHook = {
    copiedId: null,
    handleCopyId: vi.fn(),
    formatDate: vi.fn((date) => date),
    deleteTask: vi.fn(),
    openModal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTableTasks).mockReturnValue(defaultMockHook as any);
  });

  const renderComponent = (props?: {
    task?: Task;
    index?: number;
    onTaskStatusChange?: (taskId: string, newStatus: TaskStatusType) => void;
    onTaskDeleted?: () => void;
  }) => {
    return render(
      <ColumnDraggable
        index={props?.index ?? 0}
        task={props?.task ?? mockTask}
        onTaskStatusChange={props?.onTaskStatusChange}
        onTaskDeleted={props?.onTaskDeleted}
      />,
    );
  };

  it('should render task details correctly', () => {
    // Arrange & Act
    renderComponent();

    // Assert
    expect(screen.getByText('task-123')).toBeInTheDocument();
    expect(screen.getByText('Design Wireframes')).toBeInTheDocument();
    expect(screen.getByText('Create initial design drafts')).toBeInTheDocument();
    expect(screen.getByText('Diego')).toBeInTheDocument();
    expect(screen.getByTitle('Arrastrar tarea')).toBeInTheDocument();
  });

  it('should call handleCopyId when clicking the copy button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const copyBtn = screen.getByTitle('Copiar ID');

    // Act
    await user.click(copyBtn);

    // Assert
    expect(defaultMockHook.handleCopyId).toHaveBeenCalledWith('task-123');
  });

  it('should show check icon when copiedId matches task.id', () => {
    // Arrange
    vi.mocked(useTableTasks).mockReturnValue({
      ...defaultMockHook,
      copiedId: 'task-123',
    } as any);

    // Act
    renderComponent();

    // Assert
    expect(screen.getByTitle('Copiar ID')).toBeInTheDocument();
  });

  it('should render edit button for non-completed task and call openModal when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent({ task: { ...mockTask, status: TaskStatus.PENDING } });

    const editBtn = screen.getByTitle('Editar tarea');

    // Act
    await user.click(editBtn);

    // Assert
    expect(defaultMockHook.openModal).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task-123' }),
    );
  });

  it('should not render edit button when task status is COMPLETED', () => {
    // Arrange & Act
    renderComponent({ task: { ...mockTask, status: TaskStatus.COMPLETED } });

    // Assert
    expect(screen.queryByTitle('Editar tarea')).not.toBeInTheDocument();
  });

  it('should call deleteTask when clicking the delete button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const deleteBtn = screen.getByTitle('Eliminar tarea');

    // Act
    await user.click(deleteBtn);

    // Assert
    expect(defaultMockHook.deleteTask).toHaveBeenCalledWith('task-123');
  });
});
