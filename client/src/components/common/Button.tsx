import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary:   'text-white shadow-sm',
  secondary: 'border bg-white hover:bg-gray-50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'hover:bg-green-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const primaryStyle = {
  backgroundColor: '#0F5132',
  '--tw-ring-color': '#0F5132',
} as React.CSSProperties;

const secondaryStyle = {
  borderColor: '#E8E2D8',
  color: '#293B32',
} as React.CSSProperties;

const ghostStyle = {
  color: '#68736B',
} as React.CSSProperties;

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const variantStyle =
    variant === 'primary' ? primaryStyle :
    variant === 'secondary' ? secondaryStyle :
    variant === 'ghost' ? ghostStyle : undefined;

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      style={variantStyle ? { ...variantStyle, ...style } : style}
      {...props}
    >
      {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
      {children}
    </button>
  );
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
