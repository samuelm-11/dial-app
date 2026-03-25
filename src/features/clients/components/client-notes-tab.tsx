import type { ClientWithRelations } from '@/types/client';

export function ClientNotesTab({ client }: { client: ClientWithRelations }) {
  return <p className="text-sm text-slate-600 whitespace-pre-wrap">{client.internalNotes ?? 'Aucune note interne.'}</p>;
}
