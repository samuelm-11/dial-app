import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  danger: 'border border-rose-300 text-rose-700 hover:bg-rose-50',
  success: 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50',
  ghost: 'text-slate-600 hover:bg-slate-100'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm'
};

export function Button({ className = '', variant = 'secondary', size = 'md', fullWidth = false, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded transition disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    />
  );
}
