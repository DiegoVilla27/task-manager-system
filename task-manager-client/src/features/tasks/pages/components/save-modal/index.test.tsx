import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaveModal from '.';
import useSaveModal from './hooks';

vi.mock('./hooks', () => ({
  default: vi.fn(),
}));

describe('Tasks: SaveModal', () => {
  const defaultHookValues = {
    isOpen: true,
    closeModal: vi.fn(),
    register: vi.fn(() => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() })),
    submit: vi.fn((e) => e?.preventDefault?.()),
    errors: {},
    isSubmitting: false,
    isEditing: false,
    handleKeyDown: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSaveModal).mockReturnValue(defaultHookValues as any);
  });

  const renderComponent = () => {
    return render(<SaveModal />);
  };

  it('should render create task modal with default texts and inputs', () => {
    // Arrange & Act
    renderComponent();

    // Assert
    expect(screen.getByRole('heading', { level: 3, name: 'Create Task' })).toBeInTheDocument();
    expect(screen.getByText('Enter the details to create a new task.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('should render edit task modal when isEditing is true', () => {
    // Arrange
    vi.mocked(useSaveModal).mockReturnValue({
      ...defaultHookValues,
      isEditing: true,
    } as any);

    // Act
    renderComponent();

    // Assert
    expect(screen.getByRole('heading', { level: 3, name: 'Edit Task' })).toBeInTheDocument();
    expect(screen.getByText('Update the details of your task.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('should display validation errors when errors object is populated', () => {
    // Arrange
    vi.mocked(useSaveModal).mockReturnValue({
      ...defaultHookValues,
      errors: {
        title: { message: 'Title is required' },
        description: { message: 'Description must be at least 3 characters' },
      },
    } as any);

    // Act
    renderComponent();

    // Assert
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description must be at least 3 characters')).toBeInTheDocument();
  });

  it('should call closeModal when clicking the Cancel button', async () => {
    // Arrange
    const user = userEvent.setup();
    const closeModalMock = vi.fn();
    vi.mocked(useSaveModal).mockReturnValue({
      ...defaultHookValues,
      closeModal: closeModalMock,
    } as any);

    renderComponent();
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });

    // Act
    await user.click(cancelBtn);

    // Assert
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger submit on form submission', async () => {
    // Arrange
    const user = userEvent.setup();
    const submitMock = vi.fn((e) => e?.preventDefault?.());
    vi.mocked(useSaveModal).mockReturnValue({
      ...defaultHookValues,
      submit: submitMock,
    } as any);

    renderComponent();
    const submitBtn = screen.getByRole('button', { name: 'Create' });

    // Act
    await user.click(submitBtn);

    // Assert
    expect(submitMock).toHaveBeenCalled();
  });
});
