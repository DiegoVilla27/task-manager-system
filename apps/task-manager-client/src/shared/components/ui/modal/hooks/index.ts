import useModalStore from '@features/tasks/store/modalStore';
import React, { useEffect, useRef } from 'react';

export interface Props {
  isOpen: boolean;
}

const useModal = ({ isOpen }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useModalStore();

  // Manejar el scroll del body y el evento de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  // Manejar clic por fuera del contenido del modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  return {
    modalRef,
    handleBackdropClick,
    closeModal,
  };
};

export default useModal;
