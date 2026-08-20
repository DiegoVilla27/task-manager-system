import type { TaskCreateRequest, TaskUpdateRequest } from '@features/tasks/interfaces/request';
import { createTaskSvc, updateTaskSvc } from '@features/tasks/services';
import useModalStore from '@features/tasks/store/modalStore';
import type { UserMeResponse } from '@features/users/interfaces/response';
import { zodResolver } from '@hookform/resolvers/zod';
import StorageService from '@shared/utils/storage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SaveTaskSchema from '../schema';

interface FormValues {
  title: string;
  description: string;
}

const useSaveModal = () => {
  const userId = StorageService.get<UserMeResponse>('ME')?.id || '';
  const { isOpen, task, notifySuccess, closeModal } = useModalStore();

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(SaveTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'all',
  });

  const onSubmit = async (values: FormValues) => {
    if (task) {
      // Modo Edición
      const payload: TaskUpdateRequest = values;
      await updateTaskSvc(task.id, payload);
      toast.success('Task updated successfully');
      resetAndNotifySuccess();
    } else {
      // Modo Creación
      const payload: TaskCreateRequest = {
        ...values,
        userId,
      };
      await createTaskSvc(payload);
      toast.success('Task created successfully');
      reset({ title: '', description: '' });
      notifySuccess();
    }
  };

  const resetAndNotifySuccess = () => {
    reset({ title: '', description: '' });
    notifySuccess();
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
      title: task?.title || '',
      description: task?.description || '',
    });
  }, [task, reset]);

  return {
    isOpen,
    closeModal,
    register,
    submit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isEditing: !!task,
    handleKeyDown,
  };
};

export default useSaveModal;
