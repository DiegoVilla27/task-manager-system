import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from ".";

describe('UI: modal', () => {

  it('should render modal', () => {
    // Arrange
    // Act
    render(<Modal isOpen={true} onClose={() => { }}><div>Hola!</div></Modal>);
    // Assert
    expect(screen.getByText('Hola!')).toBeInTheDocument();
  });

  it('should not render modal', () => {
    // Arrange
    // Act
    render(<Modal isOpen={false} onClose={() => { }}><div>Hola!</div></Modal>);
    // Assert
    expect(screen.queryByText('Hola!')).toBeNull();
  });

  it('should render modal with title', () => {
    // Arrange
    // Act
    render(<Modal isOpen={true} title="Hola" onClose={() => { }}><div>Hola!</div></Modal>);
    // Assert
    expect(screen.getByRole('heading', { name: 'Hola' })).toBeInTheDocument();
  });

  it('should close modal with click backdrop', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    // Act
    render(<Modal isOpen={true} onClose={onClose}><div>Hola!</div></Modal>);
    await user.click(screen.getByRole('presentation'));
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when clicking inside of modal', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    // Act
    render(<Modal isOpen={true} onClose={onClose}><div>Hola!</div></Modal>);
    await user.click(screen.getByRole('dialog'));
    // Assert
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should close modal with press escape', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    // Act
    render(<Modal isOpen={true} onClose={onClose}><div>Hola!</div></Modal>);
    await user.keyboard('{Escape}');
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when press something different to escape', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    // Act
    render(<Modal isOpen={true} onClose={onClose}><div>Hola!</div></Modal>);
    await user.keyboard('{Enter}');
    // Assert
    expect(onClose).not.toHaveBeenCalled();
  });
});
