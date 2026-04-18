'use client';

import { useMemo, useState } from 'react';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form';
import { OpportunityTable } from '@/features/opportunities/components/opportunity-table';
import type { Opportunity } from '@/types/opportunity';

export function ClientOpportunitiesTab({
  clientId,
  opportunities,
  machineCategoryOptions
}: {
  clientId: string;
  opportunities: Opportunity[];
  machineCategoryOptions: Array<{ id: string; label: string }>;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  const selectedOpportunity = useMemo(
    () => opportunities.find((opportunity) => opportunity.id === selectedOpportunityId),
    [opportunities, selectedOpportunityId]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Prospection client</h3>
        <button className="rounded bg-slate-900 px-3 py-2 text-xs font-medium text-white" onClick={() => setShowCreateForm((current) => !current)}>
          {showCreateForm ? 'Masquer le formulaire' : 'Créer une prospection'}
        </button>
      </div>

      {showCreateForm ? (
        <OpportunityForm clientId={clientId} machineCategoryOptions={machineCategoryOptions} onDone={() => setShowCreateForm(false)} />
      ) : null}

      {selectedOpportunity ? (
        <div className="space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Modifier la prospection: {selectedOpportunity.title}</h4>
            <button className="text-xs text-slate-600" onClick={() => setSelectedOpportunityId(null)}>
              Fermer
            </button>
          </div>
          <OpportunityForm
            clientId={clientId}
            opportunity={selectedOpportunity}
            machineCategoryOptions={machineCategoryOptions}
            onDone={() => setSelectedOpportunityId(null)}
          />
        </div>
      ) : null}

      <OpportunityTable opportunities={opportunities} showClient={false} onEditOpportunity={(opportunity) => setSelectedOpportunityId(opportunity.id)} />
    </div>
  );
}
