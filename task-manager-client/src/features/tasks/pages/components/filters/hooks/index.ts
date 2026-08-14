import { useDebounce } from '@shared/hooks/use-debounce';
import React, { useEffect, useState } from 'react'

interface Props {
  search: string;
  setSearch: (search: string) => void;
}

const useFiltersTasks = ({ search, setSearch }: Props) => {

  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 400);

  // Sincronizar el valor debounced con la función setSearch del padre
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Sincronizar únicamente si search cambia desde el padre y no es igual a inputValue
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue('');
  };

  return {
    inputValue,
    setInputValue,
    handleClearSearch
  }
}

export default useFiltersTasks