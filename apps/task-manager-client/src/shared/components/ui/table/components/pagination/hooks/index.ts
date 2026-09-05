interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const usePagination = ({ currentPage, totalItems, itemsPerPage, totalPages }: Props) => {
  const startItem =
    totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calcular las páginas a mostrar (máximo 5 páginas dinámicas)
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start < 1) {
      start = 1;
      end = 5;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - 4;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages || totalPages === 0;

  return {
    startItem,
    endItem,
    visiblePages,
    isFirstPage,
    isLastPage,
  };
};

export default usePagination;
