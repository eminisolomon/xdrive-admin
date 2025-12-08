import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      helperText,
      fullWidth = true,
      className = '',
      type = 'text',
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-(--color-text)">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left Icon - Non-interactive */}
          {hasLeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span
                className={`text-(--color-body) ${disabled ? 'opacity-50' : ''}`}
              >
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={`
              block w-full rounded-xl border bg-(--color-surface)
              px-4 py-3.5 text-(--color-text) placeholder:text-(--color-inactive)
              transition-all duration-200 outline-none
              focus:ring-4 focus:ring-(--color-primary)/20
              disabled:bg-(--color-elevation-1) disabled:cursor-not-allowed
              ${hasLeftIcon ? 'pl-12' : 'pl-4'}
              ${hasRightIcon ? 'pr-14' : 'pr-4'}  {/* Extra space for clickable icon */}
              ${
                error
                  ? 'border-(--color-error) focus:border-(--color-error)'
                  : 'border-(--color-border) focus:border-(--color-primary)'
              }
              ${className}
            `}
            {...props}
          />

          {/* Right Icon - Interactive! */}
          {hasRightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-elevation-2 transition-colors focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  // Trigger click on the actual button inside rightIcon
                  const button = e.currentTarget.querySelector('button');
                  button?.click();
                }}
              >
                <span
                  className={`text-(--color-body) ${disabled ? 'opacity-50' : ''}`}
                >
                  {rightIcon}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Helper / Error */}
        {(helperText || errorMessage) && (
          <p
            className={`text-sm ${error ? 'text-(--color-error)' : 'text-(--color-body)'}`}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
