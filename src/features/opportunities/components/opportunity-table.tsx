'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { StatePanel } from '@/components/ui/state-panel';
import { TableShell } from '@/components/ui/table-shell';
import { convertOpportunityToClient, deleteOpportunity, updateOpportunityStatus } from '@/features/opportunities/actions';
import { OpportunityStatusBadge, opportunityStatusLabels } from '@/features/opportunities/components/opportunity-status-badge';
import { opportunityStatusValues } from '@/features/opportunities/schemas';
import type { Opportunity } from '@/types/opportunity';

const priorityLabels: Record<Opportunity['priority'], string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
};

const competitorCategoryLabels: Record<string, string> = {
  hot_drinks: 'Café / boisson chaude',
  snacking: 'Snack / confiserie',
  sandwich_catering: 'Sandwich / traiteur',
  cold_drinks: 'Boisson froide',
  water_fountain: 'Fontaine à eau',
  other: 'Autre'
};

export function OpportunityTable({
  opportunities,
  showClient = true,
  onEditOpportunity
}: {
  opportunities: Opportunity[];
  showClient?: boolean;
  onEditOpportunity?: (opportunity: Opportunity) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return <StatePanel message="Aucune prospection ne correspond aux critères." variant="empty" />;
  }

  return (
    <div className="space-y-2">
      {errorMessage ? <StatePanel message={errorMessage} variant="error" /> : null}
      <TableShell>
        <table className="min-w-[1200px] border-collapse text-sm md:min-w-full">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-slate-600">
              {showClient ? <th className="whitespace-nowrap px-3 py-2">Prospect</th> : null}
              <th className="whitespace-nowrap px-3 py-2">Titre</th>
              <th className="whitespace-nowrap px-3 py-2">Business</th>
              <th className="whitespace-nowrap px-3 py-2">Machines</th>
              <th className="whitespace-nowrap px-3 py-2">Concurrence</th>
              <th className="whitespace-nowrap px-3 py-2">Statut</th>
              <th className="whitespace-nowrap px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="border-b border-slate-100 align-top">
                {showClient ? (
                  <td className="px-3 py-2 font-medium text-slate-900">
                    <p>{opportunity.prospectName}</p>
                    {opportunity.prospectContactName ? <p className="text-xs font-normal text-slate-600">{opportunity.prospectContactName}</p> : null}
                    {opportunity.prospectCity || opportunity.prospectPostalCode ? (
                      <p className="text-xs font-normal text-slate-500">
                        {[opportunity.prospectPostalCode, opportunity.prospectCity].filter(Boolean).join(' ')}
                      </p>
                    ) : null}
                    {opportunity.clientId ? (
                      <Link href={`/clients/${opportunity.clientId}`} className="text-xs font-normal text-primary hover:underline">
                        Client: {opportunity.clientName ?? opportunity.prospectName}
                      </Link>
                    ) : null}
                  </td>
                ) : null}
                <td className="px-3 py-2 text-slate-800">
                  <p className="font-medium">{opportunity.title}</p>
                  {!showClient ? <p className="mt-1 text-xs text-slate-600">Prospect: {opportunity.prospectName}</p> : null}
                  {opportunity.description ? <p className="mt-1 max-w-sm text-xs text-slate-600">{opportunity.description}</p> : null}
                  {opportunity.notes ? <p className="mt-1 max-w-sm text-xs text-slate-500">Notes: {opportunity.notes}</p> : null}
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  <p>Priorité: {priorityLabels[opportunity.priority]}</p>
                  <p>Valeur: {opportunity.estimatedValue ? `${Math.round(opportunity.estimatedValue).toLocaleString('fr-FR')} €` : '—'}</p>
                  <p>Probabilité: {opportunity.probability !== null ? `${opportunity.probability}%` : '—'}</p>
                  <p>CA annuel: {opportunity.yearlyRevenue ? `${Math.round(opportunity.yearlyRevenue).toLocaleString('fr-FR')} €` : '—'}</p>
                  <p>Effectif: {opportunity.employeeCount ?? '—'}</p>
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  <p>Total: {opportunity.totalMachineCount ?? '—'}</p>
                  <p>Catégorie liée: {opportunity.linkedMachineCategoryLabel ?? '—'}</p>
                  <ul className="mt-1 list-disc pl-4">
                    {Object.entries(opportunity.machineCountsByCategory).length === 0 ? <li>Pas de détail</li> : null}
                    {Object.entries(opportunity.machineCountsByCategory).map(([category, count]) => (
                      <li key={category}>
                        {category}: {count}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  <p>Concurrent: {opportunity.incumbentCompetitorName ?? '—'}</p>
                  <p>
                    Position: {opportunity.incumbentCompetitorCategory ? competitorCategoryLabels[opportunity.incumbentCompetitorCategory] : '—'}
                  </p>
                  <p>Fin de contrat: {opportunity.competitorContractEndDate ?? '—'}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <OpportunityStatusBadge status={opportunity.status} />
                </td>
                <td className="space-y-2 px-3 py-2">
                  <select
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    defaultValue={opportunity.status}
                    disabled={isPending}
                    onChange={(event) => {
                      setErrorMessage(null);
                      startTransition(async () => {
                        try {
                          await updateOpportunityStatus(opportunity.id, event.target.value as Opportunity['status']);
                        } catch {
                          setErrorMessage('La mise à jour du statut a échoué. Réessayez.');
                        }
                      });
                    }}
                  >
                    {opportunityStatusValues.map((status) => (
                      <option key={status} value={status}>
                        {opportunityStatusLabels[status]}
                      </option>
                    ))}
                  </select>

                  {onEditOpportunity ? (
                    <Button size="sm" fullWidth disabled={isPending} onClick={() => onEditOpportunity(opportunity)}>
                      Modifier
                    </Button>
                  ) : null}

                  {!opportunity.clientId && opportunity.status === 'won' ? (
                    <Button
                      variant="success"
                      size="sm"
                      fullWidth
                      disabled={isPending}
                      onClick={() => {
                        setErrorMessage(null);
                        startTransition(async () => {
                          try {
                            await convertOpportunityToClient(opportunity.id);
                          } catch {
                            setErrorMessage('La création du client depuis la prospection a échoué.');
                          }
                        });
                      }}
                    >
                      Créer le client
                    </Button>
                  ) : null}

                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    disabled={isPending}
                    onClick={() => {
                      setErrorMessage(null);
                      startTransition(async () => {
                        try {
                          await deleteOpportunity(opportunity.id);
                        } catch {
                          setErrorMessage('La suppression de la prospection a échoué.');
                        }
                      });
                    }}
                  >
                    {isPending ? 'Chargement...' : 'Supprimer'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
