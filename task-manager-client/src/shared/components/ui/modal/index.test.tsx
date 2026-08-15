/**
 * @fileoverview Unit tests for the `Modal` dialog component.
 * Verifies conditional mounting, dialog role accessibility, backdrop click dismissal,
 * keyboard Escape key dismissal, and backdrop event isolation.
 *
 * @module shared/components/ui/modal.test
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '.';

describe('UI: modal', () => {
  /**
   * Verifies that when `isOpen` is `true`, the modal dialog and children are rendered into the DOM.
   */
  it('should render modal', () => {
    // Arrange & Act
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Hola!</div>
      </Modal>,
    );

    // Assert
    expect(screen.getByText('Hola!')).toBeInTheDocument();
  });

  /**
   * Verifies that when `isOpen` is `false`, modal contents are unmounted from the DOM tree.
   */
  it('should not render modal', () => {
    // Arrange & Act
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Hola!</div>
      </Modal>,
    );

    // Assert
    expect(screen.queryByText('Hola!')).toBeNull();
  });

  /**
   * Verifies that the optional dialog title is rendered within an accessible heading element.
   */
  it('should render modal with title', () => {
    // Arrange & Act
    render(
      <Modal isOpen={true} title="Hola" onClose={() => {}}>
        <div>Hola!</div>
      </Modal>,
    );

    // Assert
    expect(screen.getByRole('heading', { name: 'Hola' })).toBeInTheDocument();
  });

  /**
   * Verifies that clicking on the overlay backdrop triggers the `onClose` callback.
   */
  it('should close modal with click backdrop', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    // Act
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Hola!</div>
      </Modal>,
    );
    await user.click(screen.getByRole('presentation'));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Verifies event propagation stopping: clicking inside the modal dialog container
   * should NOT trigger the `onClose` dismissal callback.
   */
  it('should not close modal when clicking inside of modal', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    // Act
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Hola!</div>
      </Modal>,
    );
    await user.click(screen.getByRole('dialog'));

    // Assert
    expect(onClose).not.toHaveBeenCalled();
  });

  /**
   * Verifies accessible keyboard navigation: pressing the `Escape` key closes the active modal.
   */
  it('should close modal with press escape', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    // Act
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Hola!</div>
      </Modal>,
    );
    await user.keyboard('{Escape}');

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Verifies that other keystrokes (such as `Enter`) do not inadvertently dismiss the modal dialog.
   */
  it('should not close modal when press something different to escape', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    // Act
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Hola!</div>
      </Modal>,
    );
    await user.keyboard('{Enter}');

    // Assert
    expect(onClose).not.toHaveBeenCalled();
  });
});
