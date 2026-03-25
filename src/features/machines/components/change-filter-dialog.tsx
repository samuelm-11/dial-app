'use client';

import { useTransition } from 'react';
import { markFilterChanged } from '@/features/machines/actions';
import type { ClientMachine } from '@/types/machine';

export function ChangeFilterDialog({
  clientId,
  machine,
  onClose,
  onChanged
}: {
  clientId: string;
  machine: ClientMachine;
  onClose: () => void;
  onChanged: (payload: { id: string; lastFilterChangeDate: string | null; nextFilterChangeDate: string | null }) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const confirmChange = () => {
    startTransition(async () => {
      const updated = await markFilterChanged(clientId, machine.id);
      onChanged(updated);
      onClose();
    });
  };

  return (
    <div className="rounded border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-slate-700">
        Confirmer le changement de filtre pour <strong>{machine.machineTypeLabel}</strong> ?
      </p>
      <div className="mt-3 flex gap-2">
        <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={onClose}>
          Annuler
        </button>
        <button className="rounded bg-amber-600 px-3 py-2 text-sm text-white" onClick={confirmChange} disabled={isPending}>
          {isPending ? 'Mise à jour...' : 'Confirmer changement filtre'}
        </button>
      </div>
    </div>
  );
}
