import useModalStore from '@features/tasks/store/modalStore';
import type {
  PageTaskResponse,
  TaskResponse,
  TasksPaginationRequest,
  TaskStatus,
} from '@task-manager-system/api-types';
import { useCallback, useEffect, useState } from 'react';
import { getAllTasksSvc } from '../../services';

export type ViewMode = 'table' | 'kanban';

const useTasksPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [status, setStatus] = useState<TasksPaginationRequest['filters']['status']>('');
  const [search, setSearch] = useState<string>('');
  const [tasks, setTasks] = useState<PageTaskResponse | null>(null);
  const [accumulatedTasks, setAccumulatedTasks] = useState<TaskResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const { notifySuccess } = useModalStore();

  // Carga limpia para Tabla o inicial Kanban
  const fetchTasks = useCallback(async () => {
    const res = await getAllTasksSvc({ page, limit: 10, filters: { search, status } });
    setTasks(res);

    if (page === 1) {
      setAccumulatedTasks(res?.content || []);
    } else if (res?.content) {
      setAccumulatedTasks((prev) => [...prev, ...res.content!]);
    }
  }, [page, search, status]);

  // Cargar más (para Kanban infinito)
  const handleLoadMore = async () => {
    if (!tasks || page >= tasks.totalPages! || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const res = await getAllTasksSvc({ page: nextPage, limit: 10, filters: { search, status } });
    if (res?.content) {
      setPage(nextPage);
      setTasks(res);
      setAccumulatedTasks((prev) => [...prev, ...res.content!]);
    }
    setIsLoadingMore(false);
  };

  // Actualización local/optimista del estado de una tarea individual
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: prev.content!.map((task) =>
          task.id === taskId ? { ...task, status: newStatus as any } : task,
        ),
      };
    });

    setAccumulatedTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task)),
    );
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

  const handleSetStatus = (
    newStatus: React.SetStateAction<TasksPaginationRequest['filters']['status']>,
  ) => {
    setStatus(newStatus);
    setPage(1);
  };

  // Carga automática al cambiar página o filtros
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, notifySuccess]);

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
    isLoadingMore,
    hasMore: tasks ? page < tasks.totalPages! : false,
    handleLoadMore,
    handleTaskStatusChange,
    handleTaskDeleted,
  };
};

export default useTasksPage;
