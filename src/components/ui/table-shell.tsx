import type { ReactNode } from 'react';

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded border border-slate-200 bg-white">{children}</div>;
}
