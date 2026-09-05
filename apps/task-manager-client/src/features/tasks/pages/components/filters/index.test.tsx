import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersTasks from '.';

describe('', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('should render component with default values', () => {
    // Arrange
    const search = '';
    const setSearch = vi.fn();
    const status = '';
    const setStatus = vi.fn();

    // Act
    render(
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />,
    );

    // Assert
    expect(screen.getByText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByText(/Todos/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
    expect(screen.getByText(/IN_PROGRESS/i)).toBeInTheDocument();
    expect(screen.getByText(/COMPLETED/i)).toBeInTheDocument();
  });

  it('should active all status when user click btn', async () => {
    // Arrange
    const user = userEvent.setup();
    const search = '';
    const setSearch = vi.fn();
    const status = '';
    const setStatus = vi.fn();

    // Act
    render(
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />,
    );
    const btnAll = screen.getByRole('button', { name: /todos/i });
    await user.click(btnAll);

    // Assert
    expect(btnAll).toHaveClass(
      'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    );
  });

  it('should active pending status when user click btn', async () => {
    // Arrange
    const user = userEvent.setup();
    const search = '';
    const setSearch = vi.fn();
    const status = '';
    const setStatus = vi.fn();

    // Act
    const { rerender } = render(
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />,
    );
    const btnPending = screen.getByRole('button', { name: /pending/i });
    await user.click(btnPending);

    rerender(
      <FiltersTasks
        search={search}
        setSearch={setSearch}
        status={'PENDING'}
        setStatus={setStatus}
      />,
    );

    // Assert
    expect(btnPending).toHaveClass(
      'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    );
    expect(setStatus).toHaveBeenCalledWith('PENDING');
  });

  it('should active in progress status when user click btn', async () => {
    // Arrange
    const user = userEvent.setup();
    const search = '';
    const setSearch = vi.fn();
    const status = '';
    const setStatus = vi.fn();

    // Act
    const { rerender } = render(
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />,
    );
    const btnInProgress = screen.getByRole('button', { name: /in_progress/i });
    await user.click(btnInProgress);

    rerender(
      <FiltersTasks
        search={search}
        setSearch={setSearch}
        status={'IN_PROGRESS'}
        setStatus={setStatus}
      />,
    );

    // Assert
    expect(btnInProgress).toHaveClass(
      'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    );
    expect(setStatus).toHaveBeenCalledWith('IN_PROGRESS');
  });

  it('should active completed status when user click btn', async () => {
    // Arrange
    const user = userEvent.setup();
    const search = '';
    const setSearch = vi.fn();
    const status = '';
    const setStatus = vi.fn();

    // Act
    const { rerender } = render(
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />,
    );
    const btnCompleted = screen.getByRole('button', { name: /completed/i });
    await user.click(btnCompleted);

    rerender(
      <FiltersTasks
        search={search}
        setSearch={setSearch}
        status={'COMPLETED'}
        setStatus={setStatus}
      />,
    );

    // Assert
    expect(btnCompleted).toHaveClass(
      'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    );
    expect(setStatus).toHaveBeenCalledWith('COMPLETED');
  });

  it('should active search using waitFor', async () => {
    // 1. userEvent estándar sin fake timers
    const user = userEvent.setup();
    const setSearch = vi.fn();

    render(<FiltersTasks search="" setSearch={setSearch} status="" setStatus={vi.fn()} />);

    const inputSearch = screen.getByPlaceholderText(/buscar tarea/i);

    // 2. Escribimos en el input
    await user.type(inputSearch, 'Hola');

    // 3. waitFor espera los 400ms del debounce y comprueba la ÚLTIMA llamada
    await waitFor(
      () => {
        expect(setSearch).toHaveBeenLastCalledWith('Hola');
      },
      { timeout: 1500 },
    );
  });
});
