import { cn } from '@shared/utils/cn';
import { X } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import useModal from './hooks';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {

  const {
    modalRef,
    handleBackdropClick
  } = useModal({ isOpen, onClose });

  if (!isOpen) return null;

  return createPortal(
    <div
      role="presentation"
      aria-label="Cerrar modal"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-4 animate-scaleUp',
          className
        )}
        role='dialog'
      >
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors ml-auto cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
