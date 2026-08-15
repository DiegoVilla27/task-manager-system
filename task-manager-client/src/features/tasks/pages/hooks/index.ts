import { useCallback, useEffect, useState } from 'react';
import type { Task, TasksResponse, TaskStatusType } from '../interfaces/response';
import { getAllTasksSvc } from '../service';

export type ViewMode = 'table' | 'kanban';

const useTasksPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [status, setStatus] = useState<TaskStatusType | ''>('');
  const [search, setSearch] = useState<string>('');
  const [tasks, setTasks] = useState<TasksResponse | null>(null);
  const [accumulatedTasks, setAccumulatedTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Carga limpia para Tabla o inicial Kanban
  const fetchTasks = useCallback(async () => {
    const res = await getAllTasksSvc({ page, limit: 10, filters: { search, status } });
    setTasks(res);

    if (page === 1) {
      setAccumulatedTasks(res?.content || []);
    } else if (res?.content) {
      setAccumulatedTasks((prev) => [...prev, ...res.content]);
    }
  }, [page, search, status]);

  // Cargar más (para Kanban infinito)
  const handleLoadMore = async () => {
    if (!tasks || page >= tasks.totalPages || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const res = await getAllTasksSvc({ page: nextPage, limit: 10, filters: { search, status } });
    if (res?.content) {
      setPage(nextPage);
      setTasks(res);
      setAccumulatedTasks((prev) => [...prev, ...res.content]);
    }
    setIsLoadingMore(false);
  };

  // Actualización local/optimista del estado de una tarea individual
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatusType) => {
    setTasks((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: prev.content.map((task) =>
          task.id === taskId ? { ...task, status: newStatus as any } : task,
        ),
      };
    });

    setAccumulatedTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task)),
    );
  };

  // Abrir modal en modo edición
  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Abrir modal en modo creación
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Cerrar modal y limpiar tarea a editar
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // Callback cuando se elimina una tarea: refrescar lista
  const handleTaskDeleted = () => {
    fetchTasks();
  };

  // Al cambiar filtros (búsqueda o estado), resetear a la primera página
  const handleSetSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSetStatus = (newStatus: React.SetStateAction<'' | TaskStatusType>) => {
    setStatus(newStatus);
    setPage(1);
  };

  // Carga automática al cambiar página o filtros
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Callback cuando se guarda (crea o edita) una tarea exitosamente
  const handleTaskSaved = () => {
    handleCloseModal();
    fetchTasks();
  };

  return {
    viewMode,
    setViewMode,
    tasks,
    accumulatedTasks,
    page,
    setPage,
    status,
    setStatus: handleSetStatus,
    search,
    setSearch: handleSetSearch,
    isModalOpen,
    taskToEdit,
    isLoadingMore,
    hasMore: tasks ? page < tasks.totalPages : false,
    handleLoadMore,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleTaskSaved,
    handleTaskStatusChange,
    handleTaskDeleted,
  };
};

export default useTasksPage;
