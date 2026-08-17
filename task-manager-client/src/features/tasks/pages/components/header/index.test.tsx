import { render, screen } from '@testing-library/react';
import HeaderTasks from '.';
import userEvent from '@testing-library/user-event';
import useModalStore from '@features/tasks/store/modalStore';

describe('Tasks: HeaderTasks', () => {
  const setViewMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    // Arrange
    const viewMode = 'table';
    // Act
    render(<HeaderTasks viewMode={viewMode} setViewMode={setViewMode} />);
    // Assert
    expect(screen.getByRole('heading', { level: 1, name: /gestión de tareas/i }));
    expect(screen.getByText(/Administra, filtra y da seguimiento a tus proyectos pendientes/i));
  });

  it('should set view mode to table', async () => {
    // Arrange
    const viewMode = 'kanban';
    const user = userEvent.setup();

    // Act
    render(<HeaderTasks viewMode={viewMode} setViewMode={setViewMode} />);
    const btnTable = screen.getByRole('button', { name: /tabla/i });
    await user.click(btnTable);
    // Assert
    expect(setViewMode).toHaveBeenCalledTimes(1);
    expect(setViewMode).toHaveBeenCalledWith('table');
  });

  it('should set view mode to kanban', async () => {
    // Arrange
    const viewMode = 'table';
    const user = userEvent.setup();

    // Act
    render(<HeaderTasks viewMode={viewMode} setViewMode={setViewMode} />);
    const btnTable = screen.getByRole('button', { name: /kanban/i });
    await user.click(btnTable);
    // Assert
    expect(setViewMode).toHaveBeenCalledTimes(1);
    expect(setViewMode).toHaveBeenCalledWith('kanban');
  });

  it('should open model', async () => {
    // Arrange
    const viewMode = 'table';
    const user = userEvent.setup();
    const openModalMock = vi.fn();
    useModalStore.setState({ openModal: openModalMock });
    // Act
    render(<HeaderTasks viewMode={viewMode} setViewMode={setViewMode} />);
    const btnModal = screen.getByRole('button', { name: /nueva tarea/i });
    await user.click(btnModal);
    // Assert
    expect(openModalMock).toHaveBeenCalledTimes(1);
  });
});
