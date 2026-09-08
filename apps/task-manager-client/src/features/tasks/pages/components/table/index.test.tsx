import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableTasks from '.';
import useTableTasks from './hooks';
import { TaskStatus, type TaskResponse } from '@task-manager-system/api-types';

vi.mock('./hooks', () => ({
  default: vi.fn(),
}));

describe('Tasks: TableTasks', () => {
  const mockTasks: TaskResponse[] = [
    {
      id: 'task-1',
      title: 'Setup Environment',
      description: 'Configure Vite and Tailwind',
      status: TaskStatus.PENDING,
      user: { id: 'u-1', name: 'Diego', lastname: 'Villa', email: 'dv@example.com' },
      createdAt: '2026-08-16T10:00:00Z',
    },
    {
      id: 'task-2',
      title: 'Implement Authentication',
      description: 'Add JWT interceptors and guards',
      status: TaskStatus.IN_PROGRESS,
      user: { id: 'u-2', name: 'Ana', lastname: 'Gomez', email: 'ana@example.com' },
      createdAt: '2026-08-16T11:00:00Z',
    },
    {
      id: 'task-3',
      title: 'Complete Documentation',
      description: 'Write README and API specs',
      status: TaskStatus.COMPLETED,
      user: { id: 'u-3', name: 'Carlos', lastname: 'Perez', email: 'carlos@example.com' },
      createdAt: '2026-08-16T12:00:00Z',
    },
  ];

  const defaultMockHook = {
    copiedId: null,
    handleCopyId: vi.fn(),
    formatDate: vi.fn((date: string) => date || '-'),
    startTask: vi.fn(),
    completeTask: vi.fn(),
    deleteTask: vi.fn(),
    openModal: vi.fn(),
  };

  const setPageMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTableTasks).mockReturnValue(defaultMockHook as any);
  });

  const renderComponent = (props?: Partial<React.ComponentProps<typeof TableTasks>>) => {
    return render(
      <TableTasks
        tasks={props?.tasks ?? mockTasks}
        page={props?.page ?? 1}
        setPage={props?.setPage ?? setPageMock}
        totalPages={props?.totalPages ?? 3}
        totalElements={props?.totalElements ?? 30}
        onTaskStatusChange={props?.onTaskStatusChange}
        onTaskDeleted={props?.onTaskDeleted}
      />,
    );
  };

  it('should render table headers and task rows', () => {
    // Arrange & Act
    renderComponent();

    // Assert headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Tarea')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Asignado')).toBeInTheDocument();
    expect(screen.getByText('Fecha Creación')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();

    // Assert task items
    expect(screen.getByText('Setup Environment')).toBeInTheDocument();
    expect(screen.getByText('Implement Authentication')).toBeInTheDocument();
    expect(screen.getByText('Complete Documentation')).toBeInTheDocument();
  });

  it('should call handleCopyId when clicking the copy ID button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const copyButtons = screen.getAllByTitle('Copiar ID');

    // Act
    await user.click(copyButtons[0]);

    // Assert
    expect(defaultMockHook.handleCopyId).toHaveBeenCalledWith('task-1');
  });

  it('should trigger startTask when clicking on PENDING status badge', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const pendingBadge = screen.getByTitle('Haz clic para iniciar tarea');

    // Act
    await user.click(pendingBadge);

    // Assert
    expect(defaultMockHook.startTask).toHaveBeenCalledWith('task-1');
  });

  it('should trigger completeTask when clicking on IN_PROGRESS status badge', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const inProgressBadge = screen.getByTitle('Haz clic para completar tarea');

    // Act
    await user.click(inProgressBadge);

    // Assert
    expect(defaultMockHook.completeTask).toHaveBeenCalledWith('task-2');
  });

  it('should call openModal when clicking the edit button on non-completed tasks', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const editButtons = screen.getAllByTitle('Editar tarea');

    // Act
    await user.click(editButtons[0]);

    // Assert
    expect(defaultMockHook.openModal).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('should call deleteTask when clicking the delete button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent();

    const deleteButtons = screen.getAllByTitle('Eliminar tarea');

    // Act
    await user.click(deleteButtons[0]);

    // Assert
    expect(defaultMockHook.deleteTask).toHaveBeenCalledWith('task-1');
  });

  it('should render empty state message when tasks array is empty', () => {
    // Arrange & Act
    renderComponent({ tasks: [] });

    // Assert
    expect(
      screen.getByText('No se encontraron tareas con los filtros seleccionados'),
    ).toBeInTheDocument();
  });

  it('should render default badge variant when status is unknown', () => {
    // Arrange
    const unknownTask: TaskResponse = {
      ...mockTasks[0],
      status: 'ARCHIVED' as any,
    };

    // Act
    renderComponent({ tasks: [unknownTask] });

    // Assert
    expect(screen.getByText('ARCHIVED')).toBeInTheDocument();
  });

  it('should trigger setPage when pagination change occurs', async () => {
    // Arrange
    const user = userEvent.setup();
    renderComponent({ page: 1, totalPages: 3, totalElements: 30 });

    const nextBtn = screen.getByLabelText(/siguiente/i);

    // Act
    await user.click(nextBtn);

    // Assert
    expect(setPageMock).toHaveBeenCalledWith(2);
  });
});
