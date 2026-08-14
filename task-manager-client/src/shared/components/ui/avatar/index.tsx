import React from 'react';
import { cn } from '@shared/utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
  ...props
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover border border-purple-200 dark:border-purple-700',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700 flex items-center justify-center font-semibold text-purple-600 dark:text-purple-300',
        sizes[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};