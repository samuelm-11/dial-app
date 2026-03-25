import type { ReactNode } from 'react';
import { SubClientList } from '@/features/clients/components/sub-client-list';
import type { ClientWithRelations } from '@/types/client';

export function ClientOverviewTab({ client }: { client: ClientWithRelations }) {
  return (
    <div className="space-y-4">
      <dl className="grid gap-3 md:grid-cols-3">
        <Item label="Parent">{client.parent?.name ?? 'Aucun'}</Item>
        <Item label="Contrat actif">{client.hasContract ? 'Oui' : 'Non'}</Item>
        <Item label="Date installation">{client.installationDate ?? 'Non renseignée'}</Item>
      </dl>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Sous-clients</h3>
        <SubClientList subClients={client.subClients} />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Notes amélioration</h3>
        <p className="text-sm text-slate-600">{client.improvementNotes ?? 'Aucune note.'}</p>
      </div>
    </div>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded border border-slate-200 p-3">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}
