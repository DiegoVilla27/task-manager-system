
const Footer = () => {
  return (
    <footer className="h-14 bg-white dark:bg-slate-800 border-t border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <p>© {new Date().getFullYear()} TaskFlow System. Todos los derechos reservados.</p>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-purple-500 transition-colors">Privacidad</a>
        <a href="#" className="hover:text-purple-500 transition-colors">Términos</a>
        <a href="#" className="hover:text-purple-500 transition-colors">Soporte</a>
      </div>
    </footer>
  )
}

export default Footer