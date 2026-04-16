'use client';

import { useState } from 'react';
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

      <OpportunityTable opportunities={opportunities} showClient={false} />
    </div>
  );
}
