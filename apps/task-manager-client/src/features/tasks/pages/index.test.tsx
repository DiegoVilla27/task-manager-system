import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TasksPage from '.';
import useTasksPage from './hooks';
import userEvent from '@testing-library/user-event';
import { TaskStatus } from '@task-manager-system/api-types';

vi.mock('@core/http', () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('@features/tasks/pages/hooks');

describe('Tasks', () => {
  const mockedSetPage = vi.fn();

  const mockedHook = {
    viewMode: 'table',
    setViewMode: vi.fn(),
    tasks: {
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
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 0,
        paged: true,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        unpaged: true,
      },
      size: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      totalElements: 0,
      totalPages: 0,
    },
    accumulatedTasks: [],
    page: 1,
    setPage: mockedSetPage,
    status: '',
    setStatus: vi.fn(),
    search: '',
    setSearch: vi.fn(),
    isModalOpen: false,
    taskToEdit: null,
    hasMore: false,
    isLoadingMore: false,
    handleLoadMore: vi.fn(),
    handleOpenCreateModal: vi.fn(),
    handleOpenEditModal: vi.fn(),
    handleCloseModal: vi.fn(),
    handleTaskSaved: vi.fn(),
    handleTaskStatusChange: vi.fn(),
    handleTaskDeleted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(<TasksPage />, { wrapper: MemoryRouter });
  };

  it('should render component in mode table', () => {
    // Arrange
    vi.mocked(useTasksPage).mockReturnValue(mockedHook as any);
    // Act
    renderComponent();
    // Assert
    expect(screen).not.toBeNull();
  });

  it('should render component in mode kanban', () => {
    // Arrange
    vi.mocked(useTasksPage).mockReturnValue({ ...mockedHook, viewMode: 'kanban' } as any);
    // Act
    renderComponent();
    // Assert
    expect(screen.getByRole('heading', { level: 3, name: 'PENDIENTE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'EN PROGRESO' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'COMPLETADA' })).toBeInTheDocument();
  });

  it('should change page in table mode', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.mocked(useTasksPage).mockReturnValue({
      ...mockedHook,
      page: 1,
      tasks: {
        ...mockedHook.tasks,
        last: false,
        totalPages: 3,
        totalElements: 30,
      },
    } as any);
    // Act
    renderComponent();
    const nextBtn = screen.queryByLabelText(/siguiente/i);
    await user.click(nextBtn!);
    // Assert
    expect(mockedSetPage).toHaveBeenCalledTimes(1);
    expect(mockedSetPage).toHaveBeenCalledWith(2);
  });

  it('should return not results', async () => {
    // Arrange
    vi.mocked(useTasksPage).mockReturnValue({
      ...mockedHook,
      tasks: null,
    } as any);
    // Act
    renderComponent();
    const notResults = screen.getByText(/No se encontraron tareas con los filtros seleccionados/i);
    // Assert
    expect(notResults.textContent).toEqual(
      'No se encontraron tareas con los filtros seleccionados',
    );
  });
});
