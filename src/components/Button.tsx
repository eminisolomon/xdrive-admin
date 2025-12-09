import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2.5
      font-semibold rounded-xl transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-(--color-primary)/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const variants = {
      primary:
        'bg-(--color-primary) text-(--color-on-primary) hover:bg-(--color-primary)/90 active:scale-98 shadow-lg hover:shadow-xl',
      secondary:
        'bg-(--color-surface) text-(--color-text) border border-(--color-border) hover:bg-(--color-elevation-2) shadow-sm hover:shadow',
      outline:
        'bg-transparent text-(--color-primary) border-2 border-(--color-primary) hover:bg-(--color-primary)/5 active:bg-(--color-primary)/10',
      danger:
        'bg-(--color-error) text-(--color-on-error) hover:bg-(--color-error)/90 shadow-lg hover:shadow-xl',
      ghost:
        'bg-transparent text-(--color-text) hover:bg-(--color-border)/50 active:bg-(--color-border) shadow-none',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    const isButtonLoading = isLoading || loading;

    return (
      <button
        ref={ref}
        disabled={disabled || isButtonLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isButtonLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="opacity-80">{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <span>{children}</span>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
