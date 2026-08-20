import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Badge, Button } from '@shared/components/ui';
import { AlertCircle, CheckCircle2, Timer } from 'lucide-react';
import React from 'react';
import type { Task, TaskStatusType } from '../../../interfaces/response';
import ColumnDraggable from './components/draggable';
import useKanbanTasks from './hooks';

interface Props {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatusType) => void;
  onTaskDeleted?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

const COLUMNS: { id: TaskStatusType; title: string; variant: 'amber' | 'purple' | 'emerald' }[] = [
  { id: 'PENDING', title: 'PENDIENTE', variant: 'amber' },
  { id: 'IN_PROGRESS', title: 'EN PROGRESO', variant: 'purple' },
  { id: 'COMPLETED', title: 'COMPLETADA', variant: 'emerald' },
];

export const KanbanTasks: React.FC<Props> = ({
  tasks,
  onTaskStatusChange,
  onTaskDeleted,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: Props) => {
  const { handleDragEnd } = useKanbanTasks({ onTaskStatusChange });

  const getColumnIcon = (status: TaskStatusType) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'IN_PROGRESS':
        return <Timer className="w-4 h-4 text-purple-500 animate-pulse" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className="bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex flex-col max-h-[calc(100vh-280px)] min-h-112.5"
              >
                {/* Cabecera de columna */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    {getColumnIcon(column.id)}
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight">
                      {column.title}
                    </h3>
                  </div>
                  <Badge variant={column.variant} size="sm">
                    {columnTasks.length}
                  </Badge>
                </div>

                {/* Lista soltable (Droppable) */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto pr-1 space-y-3 transition-colors rounded-xl ${
                        snapshot.isDraggingOver ? 'bg-purple-500/5 ring-2 ring-purple-500/20' : ''
                      }`}
                    >
                      {columnTasks.length > 0 ? (
                        columnTasks.map((task, index) => (
                          <ColumnDraggable
                            key={task.id}
                            index={index}
                            task={task}
                            onTaskStatusChange={onTaskStatusChange}
                            onTaskDeleted={onTaskDeleted}
                          />
                        ))
                      ) : (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-xs text-slate-400 font-medium">
                          Sin tareas en este estado
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Botón de Carga Progresiva / Scroll Infinito */}
      {hasMore && (
        <div className="flex justify-center pt-2 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            isLoading={isLoadingMore}
            className="shadow-xs"
          >
            Cargar más tareas...
          </Button>
        </div>
      )}
    </div>
  );
};

export default KanbanTasks;
