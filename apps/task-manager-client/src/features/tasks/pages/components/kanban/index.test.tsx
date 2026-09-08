import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanTasks from '.';
import useKanbanTasks from './hooks';
import { TaskStatus, type TaskResponse } from '@task-manager-system/api-types';

vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        innerRef: vi.fn(),
        droppableProps: {},
        placeholder: <div data-testid="droppable-placeholder" />,
      },
      { isDraggingOver: false },
    ),
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        innerRef: vi.fn(),
        draggableProps: {},
        dragHandleProps: {},
      },
      { isDragging: false },
    ),
}));

vi.mock('./hooks', () => ({
  default: vi.fn(),
}));

describe('Tasks: KanbanTasks', () => {
  const mockTasks: TaskResponse[] = [
    {
      id: 'task-1',
      title: 'Pending Task',
      description: 'Pending task description',
      status: TaskStatus.PENDING,
      user: { id: 'u1', name: 'Diego', lastname: 'Villa', email: 'dv@example.com' },
      createdAt: '2026-08-16T10:00:00Z',
    },
    {
      id: 'task-2',
      title: 'In Progress Task',
      description: 'In progress description',
      status: TaskStatus.IN_PROGRESS,
      user: { id: 'u2', name: 'Ana', lastname: 'Gomez', email: 'ana@example.com' },
      createdAt: '2026-08-16T11:00:00Z',
    },
    {
      id: 'task-3',
      title: 'Completed Task',
      description: 'Completed description',
      status: TaskStatus.COMPLETED,
      user: { id: 'u3', name: 'Carlos', lastname: 'Perez', email: 'carlos@example.com' },
      createdAt: '2026-08-16T12:00:00Z',
    },
  ];

  const mockHandleDragEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useKanbanTasks).mockReturnValue({
      handleDragEnd: mockHandleDragEnd,
    });
  });

  const renderComponent = (props?: Partial<React.ComponentProps<typeof KanbanTasks>>) => {
    return render(
      <KanbanTasks
        tasks={props?.tasks ?? mockTasks}
        onTaskStatusChange={props?.onTaskStatusChange}
        onTaskDeleted={props?.onTaskDeleted}
        hasMore={props?.hasMore}
        onLoadMore={props?.onLoadMore}
        isLoadingMore={props?.isLoadingMore}
      />,
    );
  };

  it('should render all three status columns with titles and badges', () => {
    // Arrange & Act
    renderComponent();

    // Assert
    expect(screen.getByRole('heading', { level: 3, name: 'PENDIENTE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'EN PROGRESO' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'COMPLETADA' })).toBeInTheDocument();

    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('should display empty message when a column has no tasks', () => {
    // Arrange: Only tasks in PENDING
    const singleTask: TaskResponse[] = [mockTasks[0]];

    // Act
    renderComponent({ tasks: singleTask });

    // Assert
    const emptyMessages = screen.getAllByText('Sin tareas en este estado');
    expect(emptyMessages).toHaveLength(2); // For IN_PROGRESS and COMPLETED
  });

  it('should render load more button when hasMore is true and call onLoadMore on click', async () => {
    // Arrange
    const user = userEvent.setup();
    const onLoadMore = vi.fn();

    // Act
    renderComponent({ hasMore: true, onLoadMore, isLoadingMore: false });
    const loadMoreBtn = screen.getByRole('button', { name: /cargar más tareas/i });

    await user.click(loadMoreBtn);

    // Assert
    expect(loadMoreBtn).toBeInTheDocument();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should not render load more button when hasMore is false or undefined', () => {
    // Arrange & Act
    renderComponent({ hasMore: false });

    // Assert
    expect(screen.queryByRole('button', { name: /cargar más tareas/i })).not.toBeInTheDocument();
  });
});
