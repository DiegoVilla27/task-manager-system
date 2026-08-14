interface Props {
  children: React.ReactNode
}

export const TableBody = ({ children }: Props) => {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
      {children}
    </tbody>
  )
}
