import React, { useEffect, useRef } from 'react';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const useModal = ({ isOpen, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Manejar el scroll del body y el evento de la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Manejar clic por fuera del contenido del modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return {
    modalRef,
    handleBackdropClick,
  };
};

export default useModal;
