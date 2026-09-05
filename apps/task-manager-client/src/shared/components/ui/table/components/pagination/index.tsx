import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useTablePagination from './hooks';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const { startItem, endItem, visiblePages, isFirstPage, isLastPage } = useTablePagination({
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
  });

  return (
    <div className="px-4 sm:px-6 py-3.5 bg-slate-50/60 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div>
        Mostrando{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}</span> a{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{endItem}</span> de{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span>{' '}
        resultados
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Anterior"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-slate-50 dark:hover:enabled:bg-slate-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
              page === currentPage
                ? 'bg-purple-500 text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          aria-label="Siguiente"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-slate-50 dark:hover:enabled:bg-slate-700 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
