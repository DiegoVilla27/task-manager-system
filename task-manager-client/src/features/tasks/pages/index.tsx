import React from 'react';
import FiltersTasks from './components/filters';
import HeaderTasks from './components/header';
import KanbanTasks from './components/kanban';
import SaveModal from './components/save-modal';
import TableTasks from './components/table';
import useTasksPage from './hooks';

export const TasksPage: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    tasks,
    accumulatedTasks,
    page,
    setPage,
    status,
    setStatus,
    search,
    setSearch,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    handleTaskStatusChange,
    handleTaskDeleted,
  } = useTasksPage();

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <HeaderTasks viewMode={viewMode} setViewMode={setViewMode} />

      {/* Buscador y Filtros */}
      <FiltersTasks search={search} setSearch={setSearch} status={status} setStatus={setStatus} />

      {/* Alternar entre vista Tabla o Kanban Drag & Drop */}
      {viewMode === 'table' ? (
        <TableTasks
          tasks={tasks?.content || []}
          page={page}
          setPage={(p: number) => setPage(p)}
          totalElements={tasks?.totalElements || 0}
          totalPages={tasks?.totalPages || 0}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskDeleted={handleTaskDeleted}
        />
      ) : (
        <KanbanTasks
          tasks={accumulatedTasks}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskDeleted={handleTaskDeleted}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
        />
      )}

      {/* Modal Reutilizable de Guardado (Crear/Editar) */}
      <SaveModal />
    </div>
  );
};

export default TasksPage;
