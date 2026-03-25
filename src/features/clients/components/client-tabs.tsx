'use client';

import { useState } from 'react';
import type { ClientWithRelations } from '@/types/client';
import { ClientOverviewTab } from '@/features/clients/components/client-overview-tab';
import { ClientContactsTab } from '@/features/clients/components/client-contacts-tab';
import { ClientMachinesTab } from '@/features/clients/components/client-machines-tab';
import { ClientContractsTab } from '@/features/clients/components/client-contracts-tab';
import { ClientOpportunitiesTab } from '@/features/clients/components/client-opportunities-tab';
import { ClientAlertsTab } from '@/features/clients/components/client-alerts-tab';
import { ClientNotesTab } from '@/features/clients/components/client-notes-tab';

const tabs = ['Vue d’ensemble', 'Contacts', 'Parc machines', 'Contrats', 'Opportunités', 'Alertes', 'Notes'] as const;
type Tab = (typeof tabs)[number];

export function ClientTabs({ client }: { client: ClientWithRelations }) {
  const [activeTab, setActiveTab] = useState<Tab>('Vue d’ensemble');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded px-3 py-1 text-sm ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Vue d’ensemble' ? <ClientOverviewTab client={client} /> : null}
      {activeTab === 'Contacts' ? <ClientContactsTab client={client} /> : null}
      {activeTab === 'Parc machines' ? <ClientMachinesTab /> : null}
      {activeTab === 'Contrats' ? <ClientContractsTab /> : null}
      {activeTab === 'Opportunités' ? <ClientOpportunitiesTab /> : null}
      {activeTab === 'Alertes' ? <ClientAlertsTab /> : null}
      {activeTab === 'Notes' ? <ClientNotesTab client={client} /> : null}
    </div>
  );
}
