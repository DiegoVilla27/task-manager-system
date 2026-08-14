import React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '@shared/utils/cn';

export interface LinkProps extends RouterLinkProps {
  variant?: 'purple' | 'subtle' | 'slate';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Link: React.FC<LinkProps> = ({
  children,
  className,
  variant = 'purple',
  fontWeight = 'semibold',
  ...props
}) => {
  const variants = {
    purple: 'text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors',
    subtle: 'text-slate-500 dark:text-slate-400 hover:text-purple-500 transition-colors',
    slate: 'text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors',
  };

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <RouterLink className={cn(variants[variant], weights[fontWeight], className)} {...props}>
      {children}
    </RouterLink>
  );
};
