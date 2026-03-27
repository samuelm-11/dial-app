import type { ReactNode } from 'react';

type StatePanelProps = {
  message: string;
  variant?: 'empty' | 'loading' | 'error';
  action?: ReactNode;
};

const variantClasses = {
  empty: 'border-muted bg-white text-slate-600',
  loading: 'border-secondary/30 bg-secondary/5 text-secondary',
  error: 'border-danger/30 bg-danger/5 text-danger'
};

export function StatePanel({ message, variant = 'empty', action }: StatePanelProps) {
  return (
    <div className={`rounded-2xl border border-dashed p-5 text-sm ${variantClasses[variant]}`} role={variant === 'error' ? 'alert' : 'status'}>
      <p>{message}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
