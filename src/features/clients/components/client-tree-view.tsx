import Link from 'next/link';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import type { ClientHierarchyNode } from '@/types/client';

export function ClientTreeView({ nodes }: { nodes: ClientHierarchyNode[] }) {
  if (nodes.length === 0) {
    return <p className="rounded border border-dashed p-6 text-sm text-slate-500">Aucune hiérarchie disponible.</p>;
  }

  return (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </ul>
  );
}

function TreeNode({ node, depth }: { node: ClientHierarchyNode; depth: number }) {
  return (
    <li>
      <div className="rounded border border-slate-200 bg-white px-3 py-2" style={{ marginLeft: `${depth * 16}px` }}>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/clients/${node.id}`} className="font-medium text-slate-900 hover:underline">
            {node.name}
          </Link>
          <span className="text-xs text-slate-500">{node.city}</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{clientCategoryLabels[node.category]}</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{clientFlagLabels[node.flag]}</span>
        </div>
      </div>
      {node.children.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
