import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer';
import Header from './components/header';

export const MainLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Header fijo arriba */}
      <Header />

      {/* Main abarca exactamente la altura disponible restante y maneja su propio scroll */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col">
        <Suspense
          fallback={
            <div className="p-8 text-center text-purple-600 font-semibold">Cargando...</div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer fijo abajo */}
      <Footer />
    </div>
  );
};

export default MainLayout;
