import { act } from '@testing-library/react';
import type { Task } from '../interfaces/response';
import { TaskStatus } from '../interfaces/response';
import useModalStore from './modalStore';

describe('Tasks: modalStore', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    user: { id: 'u1', name: 'Diego', lastname: 'Villa', email: 'dv@example.com' },
    createdAt: '2026-08-16T10:00:00Z',
  };

  beforeEach(() => {
    act(() => {
      useModalStore.setState({
        isOpen: false,
        task: null,
        lastSuccess: 0,
      });
    });
  });

  it('should initialize with default values', () => {
    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.task).toBeNull();
    expect(state.lastSuccess).toBe(0);
  });

  it('should open modal without task (create mode)', () => {
    act(() => {
      useModalStore.getState().openModal();
    });

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.task).toBeNull();
  });

  it('should open modal with specific task (edit mode)', () => {
    act(() => {
      useModalStore.getState().openModal(mockTask);
    });

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.task).toEqual(mockTask);
  });

  it('should close modal and clear selected task', () => {
    act(() => {
      useModalStore.getState().openModal(mockTask);
    });
    expect(useModalStore.getState().isOpen).toBe(true);

    act(() => {
      useModalStore.getState().closeModal();
    });

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.task).toBeNull();
  });

  it('should notify success, close modal, clear task, and update lastSuccess timestamp', () => {
    const beforeTime = Date.now();

    act(() => {
      useModalStore.getState().openModal(mockTask);
    });

    act(() => {
      useModalStore.getState().notifySuccess();
    });

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.task).toBeNull();
    expect(state.lastSuccess).toBeGreaterThanOrEqual(beforeTime);
  });
});
