import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return <div className={`rounded-2xl border border-muted bg-white p-5 shadow-card ${className}`.trim()}>{children}</div>;
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`mb-4 flex items-start justify-between gap-3 ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <h2 className={`text-base font-semibold text-primary ${className}`.trim()}>{children}</h2>;
}

export function CardDescription({ children, className = '' }: CardProps) {
  return <p className={`text-sm text-slate-500 ${className}`.trim()}>{children}</p>;
}
