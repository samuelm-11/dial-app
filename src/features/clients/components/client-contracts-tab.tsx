'use client';

import { useState } from 'react';
import { ContractForm } from '@/features/contracts/components/contract-form';
import { ContractUploadField } from '@/features/contracts/components/contract-upload-field';
import type { Contract } from '@/types/contract';

export function ClientContractsTab({ clientId, contracts }: { clientId: string; contracts: Contract[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <ContractForm clientId={clientId} onDone={() => setEditingId(null)} />

      {contracts.length === 0 ? (
        <p className="rounded border border-dashed p-4 text-sm text-slate-500">Aucun contrat pour ce client.</p>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="space-y-2 rounded border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{contract.title}</p>
                </div>
                <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => setEditingId(editingId === contract.id ? null : contract.id)}>
                  {editingId === contract.id ? 'Fermer édition' : 'Modifier'}
                </button>
              </div>

              <dl className="grid gap-x-4 gap-y-2 rounded border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Date de début</dt>
                  <dd>{contract.startDate}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Date de fin</dt>
                  <dd>{contract.endDate}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Auto-renouvellement</dt>
                  <dd>{contract.autoRenewal ? 'Oui' : 'Non'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Chemin PDF</dt>
                  <dd className="break-all">{contract.privatePdfPath ?? 'Aucun PDF'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-slate-900">Notes</dt>
                  <dd>{contract.notes ?? 'Aucune note'}</dd>
                </div>
              </dl>

              {editingId === contract.id ? <ContractForm clientId={clientId} contract={contract} onDone={() => setEditingId(null)} /> : null}
              <ContractUploadField clientId={clientId} contract={contract} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
