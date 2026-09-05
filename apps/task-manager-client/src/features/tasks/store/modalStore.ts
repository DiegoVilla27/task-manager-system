import { create } from 'zustand';
import type { Task } from '../interfaces/response';

interface ModalStore {
  isOpen: boolean;
  task: Task | null;
  lastSuccess: number;
  openModal: (task?: Task | null) => void;
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
