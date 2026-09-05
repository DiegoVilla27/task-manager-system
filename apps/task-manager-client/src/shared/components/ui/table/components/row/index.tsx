interface Props {
  children: React.ReactNode;
  className?: string;
}

export const TableRow = ({ children, className = '' }: Props) => {
  return (
    <tr
      className={`hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors group ${className}`}
    >
      {children}
    </tr>
  );
};
