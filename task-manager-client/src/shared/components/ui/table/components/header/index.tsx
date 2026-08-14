interface Props {
  children: React.ReactNode
}

export const TableHeader = ({ children }: Props) => {
  return (
    <thead>
      <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {children}
      </tr>
    </thead>
  )
}