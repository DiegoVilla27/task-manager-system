import type { Task } from '@features/tasks/interfaces/response';
import { TaskStatus } from '@features/tasks/interfaces/response';
import { createTaskSvc, updateTaskSvc } from '@features/tasks/services';
import useModalStore from '@features/tasks/store/modalStore';
import StorageService from '@shared/utils/storage';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'sonner';
import useSaveModal from '.';

vi.mock('@features/tasks/services', () => ({
  createTaskSvc: vi.fn(),
  updateTaskSvc: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@shared/utils/storage', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('Tasks: useSaveModal', () => {
  const mockTask: Task = {
    id: 'task-100',
    title: 'Existing Task',
    description: 'Existing Description',
    status: TaskStatus.PENDING,
    user: { id: 'user-1', name: 'Diego', lastname: 'Villa', email: 'dv@example.com' },
    createdAt: '2026-08-16T10:00:00Z',
  };

  const TestForm: React.FC = () => {
    const { register, submit, handleKeyDown } = useSaveModal();
    return React.createElement(
      'form',
      { onSubmit: submit, onKeyDown: handleKeyDown },
      React.createElement('input', { ...register('title'), placeholder: 'Title' }),
      React.createElement('input', { ...register('description'), placeholder: 'Description' }),
      React.createElement('button', { type: 'submit' }, 'Save'),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StorageService.get).mockReturnValue({ id: 'user-1' });
    useModalStore.setState({
      isOpen: false,
      task: null,
      notifySuccess: vi.fn(),
      closeModal: vi.fn(),
      openModal: vi.fn(),
    });
  });

  it('should initialize in create mode when task is null', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSaveModal());

    // Assert
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it('should initialize in edit mode when task is present in store', () => {
    // Arrange
    useModalStore.setState({ task: mockTask, isOpen: true });

    // Act
    const { result } = renderHook(() => useSaveModal());

    // Assert
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isOpen).toBe(true);
  });

  it('should submit valid creation form data and call createTaskSvc and notifySuccess', async () => {
    // Arrange
    const user = userEvent.setup();
    const notifySuccessMock = vi.fn();
    useModalStore.setState({ task: null, isOpen: true, notifySuccess: notifySuccessMock });
    vi.mocked(createTaskSvc).mockResolvedValue(mockTask);

    render(React.createElement(TestForm));

    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    // Act
    await user.type(titleInput, 'Brand New Task');
    await user.type(descriptionInput, 'Brand New Description');
    await user.click(saveButton);

    // Assert
    expect(createTaskSvc).toHaveBeenCalledWith({
      title: 'Brand New Task',
      description: 'Brand New Description',
      userId: 'user-1',
    });
    expect(toast.success).toHaveBeenCalledWith('Task created successfully');
    expect(notifySuccessMock).toHaveBeenCalledTimes(1);
  });

  it('should submit form via handleKeyDown Enter in create mode', async () => {
    // Arrange
    const user = userEvent.setup();
    const notifySuccessMock = vi.fn();
    useModalStore.setState({ task: null, isOpen: true, notifySuccess: notifySuccessMock });
    vi.mocked(createTaskSvc).mockResolvedValue(mockTask);

    render(React.createElement(TestForm));

    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');

    // Act
    await user.type(titleInput, 'Keyboard Task');
    await user.type(descriptionInput, 'Keyboard Description{enter}');

    // Assert
    expect(createTaskSvc).toHaveBeenCalledWith({
      title: 'Keyboard Task',
      description: 'Keyboard Description',
      userId: 'user-1',
    });
  });

  it('should call updateTaskSvc and notifySuccess when submitting in edit mode', async () => {
    // Arrange
    const notifySuccessMock = vi.fn();
    useModalStore.setState({ task: mockTask, isOpen: true, notifySuccess: notifySuccessMock });
    vi.mocked(updateTaskSvc).mockResolvedValue(mockTask);

    const { result } = renderHook(() => useSaveModal());

    // Act: Trigger keydown enter
    const enterEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleKeyDown(enterEvent);
    });

    // Assert
    expect(enterEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(updateTaskSvc).toHaveBeenCalledWith('task-100', {
      title: 'Existing Task',
      description: 'Existing Description',
    });
    expect(toast.success).toHaveBeenCalledWith('Task updated successfully');
    expect(notifySuccessMock).toHaveBeenCalledTimes(1);
  });

  it('should not submit on handleKeyDown if key is not Enter', async () => {
    // Arrange
    const { result } = renderHook(() => useSaveModal());
    const escapeEvent = {
      key: 'Escape',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLFormElement>;

    // Act
    await act(async () => {
      await result.current.handleKeyDown(escapeEvent);
    });

    // Assert
    expect(escapeEvent.preventDefault).not.toHaveBeenCalled();
    expect(createTaskSvc).not.toHaveBeenCalled();
    expect(updateTaskSvc).not.toHaveBeenCalled();
  });

  it('should handle userId fallback when Storage ME is empty', () => {
    // Arrange
    vi.mocked(StorageService.get).mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useSaveModal());

    // Assert
    expect(result.current.isEditing).toBe(false);
  });
});
