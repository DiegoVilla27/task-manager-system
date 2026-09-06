import type { TaskResponse } from '@task-manager-system/api-types';
import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  task: TaskResponse | null;
  lastSuccess: number;
  openModal: (task?: TaskResponse | null) => void;
  closeModal: () => void;
  notifySuccess: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  task: null,
  lastSuccess: 0,
  openModal: (task = null) => set({ isOpen: true, task }),
  closeModal: () => set({ isOpen: false, task: null }),
  notifySuccess: () =>
    set({
      isOpen: false,
      task: null,
      lastSuccess: Date.now(),
    }),
}));

export default useModalStore;
