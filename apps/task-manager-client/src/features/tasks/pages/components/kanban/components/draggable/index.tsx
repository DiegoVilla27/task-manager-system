import { Draggable } from '@hello-pangea/dnd';
import { Avatar, Button } from '@shared/components/ui';
import { Calendar, Check, Copy, GripVertical, Pencil, Trash2 } from 'lucide-react';
import useTableTasks from '../../../table/hooks';
import type { TaskResponse, TaskStatus } from '@task-manager-system/api-types';

interface Props {
  index: number;
  task: TaskResponse;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskDeleted?: () => void;
}

const ColumnDraggable = ({ index, task, onTaskDeleted, onTaskStatusChange }: Props) => {
  const { copiedId, handleCopyId, formatDate, deleteTask, openModal } = useTableTasks({
    onTaskStatusChange,
    onTaskDeleted,
  });

  return (
    <Draggable key={task.id} draggableId={task.id!} index={index}>
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
                type="button"
                onClick={() => handleCopyId(task.id!)}
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
                  onClick={() => openModal(task)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                title="Eliminar tarea"
                onClick={() => deleteTask(task.id!)}
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
                name={`${task.user?.name} ${task.user?.lastname}`}
                size="sm"
                className="w-6 h-6 text-[10px]"
              />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {task.user?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.createdAt!)}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnDraggable;
