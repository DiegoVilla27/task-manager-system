import type { DropResult } from "@hello-pangea/dnd";
import { completeTaskSvc, startTaskSvc } from "@features/tasks/pages/service";
import type { TaskStatusType } from "../../../interfaces/response";
import useTableTasks from "../../table/hooks";
import { toast } from "sonner";

interface Props {
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatusType) => void;
  onTaskDeleted?: () => void;
}

const useKanbanTasks = ({ onTaskStatusChange, onTaskDeleted }: Props) => {
  const { copiedId, handleCopyId, formatDate, deleteTask } = useTableTasks({
    onTaskStatusChange,
    onTaskDeleted,
  });

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const currentStatus = source.droppableId as TaskStatusType;
    const targetStatus = destination.droppableId as TaskStatusType;

    // Regla de Negocio 1: PENDING -> IN_PROGRESS únicamente
    if (currentStatus === 'PENDING' && targetStatus === 'IN_PROGRESS') {
      // 1. Cambio optimista local
      onTaskStatusChange?.(draggableId, 'IN_PROGRESS');
      
      // 2. Intento de persitencia en backend
      const success = await startTaskSvc(draggableId);
      
      if (success) {
        toast.success("Task started");
      } else {
        // 3. Rollback si falla el servicio
        onTaskStatusChange?.(draggableId, 'PENDING');
        toast.error("Error al iniciar tarea. Se revirtió el cambio.");
      }
      return;
    }

    // Regla de Negocio 2: IN_PROGRESS -> COMPLETED únicamente
    if (currentStatus === 'IN_PROGRESS' && targetStatus === 'COMPLETED') {
      // 1. Cambio optimista local
      onTaskStatusChange?.(draggableId, 'COMPLETED');
      
      // 2. Intento de persistencia en backend
      const success = await completeTaskSvc(draggableId);

      if (success) {
        toast.success("Task completed");
      } else {
        // 3. Rollback si falla el servicio
        onTaskStatusChange?.(draggableId, 'IN_PROGRESS');
        toast.error("Error al completar tarea. Se revirtió el cambio.");
      }
      return;
    }

    // Reversas o saltos no permitidos
    toast.error("Movimiento no permitido. La tarea solo puede avanzar de PENDING a IN_PROGRESS y luego a COMPLETED.");
  };

  return {
    copiedId,
    handleCopyId,
    formatDate,
    deleteTask,
    handleDragEnd,
  };
};

export default useKanbanTasks;
