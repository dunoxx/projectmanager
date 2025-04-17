import React from 'react';
import { cn } from '../../utils/classnames';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente de indicação de carregamento
 */
const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Spinner; 