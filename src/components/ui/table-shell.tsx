import type { ReactNode } from 'react';

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="w-full overflow-x-auto rounded-2xl border border-muted bg-white shadow-card [-webkit-overflow-scrolling:touch]">{children}</div>;
}
