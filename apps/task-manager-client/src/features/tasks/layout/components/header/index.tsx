import { Avatar, Button } from '@shared/components/ui';
import { Bell, CheckSquare, LogOut } from 'lucide-react';
import useHeader from './hooks';

const Header = () => {
  const { user, logout } = useHeader();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Task<span className="text-purple-500">Flow</span>
          </span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 relative rounded-lg"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500"></span>
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={user?.name + ' ' + user?.lastname} size="md" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                {user?.name + ' ' + user?.lastname}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Button
            className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Cerrar Sesión"
            variant="ghost"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
