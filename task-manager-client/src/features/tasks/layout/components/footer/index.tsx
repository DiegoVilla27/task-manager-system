const Footer = () => {
  return (
    <footer className="h-14 bg-white dark:bg-slate-800 border-t border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-8 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
      <p>© {new Date().getFullYear()} TaskFlow System. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
