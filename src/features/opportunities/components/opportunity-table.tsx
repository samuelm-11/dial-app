'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { deleteOpportunity, updateOpportunityStatus } from '@/features/opportunities/actions';
import { OpportunityStatusBadge, opportunityStatusLabels } from '@/features/opportunities/components/opportunity-status-badge';
import { opportunityStatusValues } from '@/features/opportunities/schemas';
import type { Opportunity } from '@/types/opportunity';

const priorityLabels: Record<Opportunity['priority'], string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
};

export function OpportunityTable({ opportunities, showClient = true }: { opportunities: Opportunity[]; showClient?: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (opportunities.length === 0) {
    return <p className="rounded border border-dashed p-6 text-sm text-slate-500">Aucune opportunité ne correspond aux critères.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            {showClient ? <th className="px-3 py-2">Client</th> : null}
            <th className="px-3 py-2">Titre</th>
            <th className="px-3 py-2">Catégorie liée</th>
            <th className="px-3 py-2">Priorité</th>
            <th className="px-3 py-2">Statut</th>
            <th className="px-3 py-2">Valeur (€)</th>
            <th className="px-3 py-2">Probabilité</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opportunity) => (
            <tr key={opportunity.id} className="border-b border-slate-100 align-top">
              {showClient ? (
                <td className="px-3 py-2 font-medium text-slate-900">
                  <Link href={`/clients/${opportunity.clientId}`} className="hover:underline">
                    {opportunity.clientName}
                  </Link>
                </td>
              ) : null}
              <td className="px-3 py-2 text-slate-800">
                <p className="font-medium">{opportunity.title}</p>
                {opportunity.description ? <p className="mt-1 max-w-sm text-xs text-slate-600">{opportunity.description}</p> : null}
              </td>
              <td className="px-3 py-2 text-slate-700">{opportunity.linkedMachineCategoryLabel ?? '—'}</td>
              <td className="px-3 py-2 text-slate-700">{priorityLabels[opportunity.priority]}</td>
              <td className="px-3 py-2">
                <OpportunityStatusBadge status={opportunity.status} />
              </td>
              <td className="px-3 py-2 text-slate-700">{opportunity.estimatedValue ? `${Math.round(opportunity.estimatedValue).toLocaleString('fr-FR')} €` : '—'}</td>
              <td className="px-3 py-2 text-slate-700">{opportunity.probability !== null ? `${opportunity.probability}%` : '—'}</td>
              <td className="space-y-2 px-3 py-2">
                <select
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  defaultValue={opportunity.status}
                  disabled={isPending}
                  onChange={(event) =>
                    startTransition(async () => {
                      await updateOpportunityStatus(opportunity.clientId, opportunity.id, event.target.value as Opportunity['status']);
                    })
                  }
                >
                  {opportunityStatusValues.map((status) => (
                    <option key={status} value={status}>
                      {opportunityStatusLabels[status]}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="w-full rounded border border-rose-300 px-2 py-1 text-xs text-rose-700"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await deleteOpportunity(opportunity.clientId, opportunity.id);
                    })
                  }
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
