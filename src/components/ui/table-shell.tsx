import type { ReactNode } from 'react';

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="w-full overflow-x-auto rounded border border-slate-200 bg-white [-webkit-overflow-scrolling:touch]">{children}</div>;
}
