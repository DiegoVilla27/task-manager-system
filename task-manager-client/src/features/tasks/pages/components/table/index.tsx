import {
  Avatar,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TablePagination,
  TableRow,
} from '@shared/components/ui';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Pencil,
  Timer,
  Trash2,
} from 'lucide-react';
import type { Task, TaskStatusType } from '../../interfaces/response';
import useTableTasks from './hooks';

interface Props {
  tasks: Task[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalElements: number;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatusType) => void;
  onTaskDeleted?: () => void;
  onEditTask?: (task: Task) => void;
}

const TableTasks: React.FC<Props> = ({
  tasks,
  page,
  setPage,
  totalElements,
  totalPages,
  onTaskStatusChange,
  onTaskDeleted,
  onEditTask,
}: Props) => {
  const { copiedId, handleCopyId, formatDate, startTask, completeTask, deleteTask } = useTableTasks(
    { onTaskStatusChange, onTaskDeleted },
  );

  const renderStatusBadge = (status: TaskStatusType, taskId: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="amber"
            icon={<AlertCircle className="w-3.5 h-3.5" />}
            onClick={() => startTask(taskId)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Haz clic para iniciar tarea"
          >
            PENDING
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge
            variant="purple"
            icon={<Timer className="w-3.5 h-3.5 animate-pulse" />}
            onClick={() => completeTask(taskId)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Haz clic para completar tarea"
          >
            IN_PROGRESS
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="emerald" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            COMPLETED
          </Badge>
        );
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs overflow-hidden flex-1 flex flex-col">
      <Table>
        <TableHeader>
          <TableCell
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            ID
          </TableCell>
          <TableCell
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            Tarea
          </TableCell>
          <TableCell
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            Estado
          </TableCell>
          <TableCell
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            Asignado
          </TableCell>
          <TableCell
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            Fecha Creación
          </TableCell>
          <TableCell
            align="right"
            isHeader
            className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase"
          >
            Acciones
          </TableCell>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task: Task) => (
              <TableRow key={task.id}>
                {/* ID separado con botón para copiar */}
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded-md border border-purple-100 dark:border-purple-800/60 max-w-25 truncate"
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
                </TableCell>

                {/* Título y Descripción */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {task.description}
                    </span>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell className="whitespace-nowrap">
                  {renderStatusBadge(task.status, task.id)}
                </TableCell>

                {/* Asignado */}
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Avatar name={`${task.user.name} ${task.user.lastname}`} size="sm" />
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {`${task.user.name} ${task.user.lastname}`}
                    </span>
                  </div>
                </TableCell>

                {/* Fecha dd/mm/yyyy */}
                <TableCell className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </TableCell>

                {/* Acciones: Editar y Eliminar */}
                <TableCell align="right" className="whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {task.status !== 'COMPLETED' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        title="Editar tarea"
                        onClick={() => onEditTask?.(task)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Eliminar tarea"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-12 text-slate-400">
                No se encontraron tareas con los filtros seleccionados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalElements}
        itemsPerPage={10}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default TableTasks;
