interface Props {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
}

export const TableCell = ({
  children,
  isHeader = false,
  className = '',
  align = 'left',
  colSpan,
}: Props) => {
  const alignClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  // Renderizado dinámico del tag: 'th' o 'td'
  const Component = isHeader ? 'th' : 'td';

  return (
    <Component colSpan={colSpan} className={`py-4 px-4 sm:px-6 ${alignClass} ${className}`}>
      {children}
    </Component>
  );
};
