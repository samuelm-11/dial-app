import type { ReactNode } from 'react';

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <table className={`min-w-[760px] border-collapse md:min-w-full ${className}`.trim()}>{children}</table>;
}
