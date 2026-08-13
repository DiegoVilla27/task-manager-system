import React from 'react';
import { Button, Input, Modal } from "@shared/components/ui";
import type { Task } from "../../interfaces/response";
import useSaveModal from "./hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit: Task | null;
}

const SaveModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, taskToEdit }: Props) => {
  const {
    register,
    submit,
    errors,
    isSubmitting,
    isEditing,
    handleKeyDown
  } = useSaveModal({ taskToEdit, onSuccess });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Create Task"}
    >
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        {isEditing ? "Update the details of your task." : "Enter the details to create a new task."}
      </p>
      <form
        className="space-y-4"
        onSubmit={submit}
        onKeyDown={handleKeyDown}
      >
        <Input
          label="Title"
          type="text"
          placeholder="Task Title"
          {...register('title')}
          error={errors.title?.message}
        />

        <Input
          label="Description"
          type="text"
          placeholder="Task Description"
          {...register('description')}
          error={errors.description?.message}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SaveModal;
