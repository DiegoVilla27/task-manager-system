import { completeTaskSvc, deleteTaskSvc, startTaskSvc } from '@features/tasks/services';
import { useState } from 'react';
import { toast } from 'sonner';
import useModalStore from '@features/tasks/store/modalStore';
import type { TaskStatus } from '@task-manager-system/api-types';

interface Props {
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskDeleted?: () => void;
}

const useTableTasks = ({ onTaskStatusChange, onTaskDeleted }: Props = {}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { openModal } = useModalStore();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('ID copiado al portapapeles');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const startTask = async (taskId: string) => {
    // Actualización optimista local
    onTaskStatusChange?.(taskId, 'IN_PROGRESS');
    const success = await startTaskSvc(taskId);

    if (success) {
      toast.success('Task started');
    } else {
      // Revertir en caso de falla en el servidor
      onTaskStatusChange?.(taskId, 'PENDING');
      toast.error('Error al iniciar tarea. Se revirtió el cambio.');
    }
  };

  const completeTask = async (taskId: string) => {
    // Actualización optimista local
    onTaskStatusChange?.(taskId, 'COMPLETED');
    const success = await completeTaskSvc(taskId);

    if (success) {
      toast.success('Task completed');
    } else {
      // Revertir en caso de falla en el servidor
      onTaskStatusChange?.(taskId, 'IN_PROGRESS');
      toast.error('Error al completar tarea. Se revirtió el cambio.');
    }
  };

  const deleteTask = async (taskId: string) => {
    const success = await deleteTaskSvc(taskId);
    if (success) {
      toast.success('Task deleted');
      onTaskDeleted?.();
    } else {
      toast.error('Error al eliminar la tarea.');
    }
  };

  return {
    copiedId,
    handleCopyId,
    formatDate,
    startTask,
    completeTask,
    deleteTask,
    openModal,
  };
};

export default useTableTasks;
