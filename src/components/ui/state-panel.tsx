import type { ReactNode } from 'react';

type StatePanelProps = {
  message: string;
  variant?: 'empty' | 'loading' | 'error';
  action?: ReactNode;
};

const variantClasses = {
  empty: 'border-slate-300 bg-white text-slate-600',
  loading: 'border-sky-200 bg-sky-50 text-sky-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800'
};

export function StatePanel({ message, variant = 'empty', action }: StatePanelProps) {
  return (
    <div className={`rounded border border-dashed p-4 text-sm ${variantClasses[variant]}`} role={variant === 'error' ? 'alert' : 'status'}>
      <p>{message}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
