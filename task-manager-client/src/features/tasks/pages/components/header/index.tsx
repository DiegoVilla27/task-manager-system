import { Button } from '@shared/components/ui';
import { LayoutGrid, Plus, Table as TableIcon } from 'lucide-react';
import type { ViewMode } from '../../hooks';
import useModalStore from '@features/tasks/store/modalStore';

interface Props {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const HeaderTasks = ({ viewMode, setViewMode }: Props) => {
  const { openModal } = useModalStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Gestión de Tareas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administra, filtra y da seguimiento a tus proyectos pendientes
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle para alternar entre vista Tabla y Kanban */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabla</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openModal()}
        >
          Nueva Tarea
        </Button>
      </div>
    </div>
  );
};

export default HeaderTasks;
