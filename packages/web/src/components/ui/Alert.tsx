import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../utils/classnames';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600",
        success:
          "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  className, 
  variant, 
  title, 
  description, 
  children, 
  ...props 
}) => {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {title && (
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          {title}
        </h5>
      )}
      {description && (
        <div className="text-sm opacity-90">
          {description}
        </div>
      )}
      {children}
    </div>
  );
};

export default Alert; 