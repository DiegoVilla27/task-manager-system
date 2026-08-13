import type { TaskCreateRequest, TaskUpdateRequest } from "@features/tasks/pages/interfaces/request";
import type { Task } from "@features/tasks/pages/interfaces/response";
import { createTaskSvc, updateTaskSvc } from "@features/tasks/pages/service";
import type { UserMeResponse } from "@features/users/interfaces/response";
import { zodResolver } from "@hookform/resolvers/zod";
import StorageService from "@shared/utils/storage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SaveTaskSchema from "../schema";

interface Props {
  taskToEdit: Task | null;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  description: string;
}

const useSaveModal = ({ taskToEdit, onSuccess }: Props) => {
  const userId = StorageService.get<UserMeResponse>('ME')?.id || '';

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(SaveTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'all'
  });

  const onSubmit = async (values: FormValues) => {
    if (taskToEdit) {
      // Modo Edición
      const payload: TaskUpdateRequest = values;
      const res = await updateTaskSvc(taskToEdit.id, payload);
      if (res) {
        toast.success("Task updated successfully");
        reset({ title: '', description: '' });
        onSuccess();
      }
    } else {
      // Modo Creación
      const payload: TaskCreateRequest = {
        ...values,
        userId,
      };
      const res = await createTaskSvc(payload);
      if (res) {
        toast.success("Task created successfully");
        reset({ title: '', description: '' });
        onSuccess();
      }
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Desencadena la validación de Zod en todos los campos para mostrar mensajes de error
      const isValid = await trigger();
      if (isValid) {
        handleSubmit(onSubmit)();
      }
    }
  };

  // Al cambiar taskToEdit o resetear el formulario, actualizar valores por defecto
  useEffect(() => {
    reset({
      title: taskToEdit?.title || '',
      description: taskToEdit?.description || '',
    });
  }, [taskToEdit, reset]);

  return {
    register,
    submit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isEditing: !!taskToEdit,
    handleKeyDown,
  };
};

export default useSaveModal;
