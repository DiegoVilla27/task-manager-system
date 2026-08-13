import { Avatar, Badge, Button } from "@shared/components/ui";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AlertCircle, Calendar, Check, CheckCircle2, Copy, GripVertical, Pencil, Timer, Trash2 } from "lucide-react";
import React from "react";
import type { Task, TaskStatusType } from "../../interfaces/response";
import useKanbanTasks from "./hooks";

interface Props {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatusType) => void;
  onTaskDeleted?: () => void;
  onEditTask?: (task: Task) => void;
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
  onEditTask,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: Props) => {
  const { copiedId, handleCopyId, formatDate, deleteTask, handleDragEnd } = useKanbanTasks({
    onTaskStatusChange,
    onTaskDeleted,
  });

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
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(providedDrag, snapshotDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                className={`bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-xs transition-all flex flex-col gap-2 group ${
                                  snapshotDrag.isDragging
                                    ? 'shadow-xl ring-2 ring-purple-500 scale-[1.02] z-50'
                                    : 'border-slate-200/80 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
                                }`}
                              >
                                {/* Top Bar de Tarjeta */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      {...providedDrag.dragHandleProps}
                                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing"
                                      title="Arrastrar tarea"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    <span
                                      className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-800/60 max-w-24 truncate"
                                      title={task.id}
                                    >
                                      {task.id}
                                    </span>
                                    <button
                                      onClick={() => handleCopyId(task.id)}
                                      className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                      title="Copiar ID"
                                    >
                                      {copiedId === task.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Acciones Editar/Eliminar */}
                                  <div className="flex items-center gap-1">
                                    {task.status !== 'COMPLETED' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1.5 h-7 w-7 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                                        title="Editar tarea"
                                        onClick={() => onEditTask?.(task)}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1.5 h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                      title="Eliminar tarea"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Título & Descripción */}
                                <div>
                                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                                    {task.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                    {task.description}
                                  </p>
                                </div>

                                {/* Footer de Tarjeta */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-1">
                                  <div className="flex items-center gap-1.5">
                                    <Avatar
                                      name={`${task.user.name} ${task.user.lastname}`}
                                      size="sm"
                                      className="w-6 h-6 text-[10px]"
                                    />
                                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                      {task.user.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(task.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
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
