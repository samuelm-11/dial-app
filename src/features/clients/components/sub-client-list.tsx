import Link from 'next/link';
import { clientFlagLabels } from '@/features/clients/helpers';
import type { ClientWithRelations } from '@/types/client';

export function SubClientList({ subClients }: { subClients: ClientWithRelations['subClients'] }) {
  if (subClients.length === 0) {
    return <p className="text-sm text-slate-500">Aucun sous-client rattaché.</p>;
  }

  return (
    <ul className="space-y-2">
      {subClients.map((subClient) => (
        <li key={subClient.id} className="rounded border border-slate-200 p-2 text-sm">
          <Link href={`/clients/${subClient.id}`} className="font-medium hover:underline">
            {subClient.name}
          </Link>
          <span className="ml-2 text-slate-500">{subClient.city}</span>
          <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs">{clientFlagLabels[subClient.flag]}</span>
        </li>
      ))}
    </ul>
  );
}
