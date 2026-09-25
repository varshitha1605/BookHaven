import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:border-transparent
            ${error ? 'border-red-400 focus:ring-red-400' : ''}
            ${className}`}
          style={!error ? { borderColor: '#E8E2D8', color: '#293B32', '--tw-ring-color': '#0F5132' } as React.CSSProperties
            : { borderColor: '#FCA5A5' }}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
