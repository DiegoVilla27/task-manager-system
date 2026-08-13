import { useState, useEffect } from "react";
import { Button, Input } from "@shared/components/ui";
import { Filter, Search, X } from "lucide-react";
import { useDebounce } from "@shared/hooks/useDebounce";
import { TaskStatus } from "../../interfaces/response";

interface Props {
  search: string;
  setSearch: (search: string) => void;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<"" | "PENDING" | "IN_PROGRESS" | "COMPLETED">>;
}

const FiltersTasks = ({ search, setSearch, status, setStatus }: Props) => {
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 400);

  // Sincronizar el valor debounced con la función setSearch del padre
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Sincronizar únicamente si search cambia desde el padre y no es igual a inputValue
  useEffect(() => {
    if (search !== inputValue) {
      setInputValue(search);
    }
  }, [search]);

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="w-full md:w-80">
        <Input
          placeholder="Buscar tareas por título o ID..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            inputValue ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Filtros Status (Enum) */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Estado:
        </span>

        <Button
          size="sm"
          variant={status === '' ? 'primary' : 'secondary'}
          onClick={() => setStatus('')}
        >
          Todos
        </Button>

        {
          Object.values(TaskStatus).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? 'primary' : 'secondary'}
              onClick={() => setStatus(s)}
            >
              {s}
            </Button>
          ))
        }
      </div>
    </div>
  );
};

export default FiltersTasks;