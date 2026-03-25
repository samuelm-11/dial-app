'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { removeClientMachine } from '@/features/machines/actions';
import { ChangeFilterDialog } from '@/features/machines/components/change-filter-dialog';
import { MachineForm } from '@/features/machines/components/machine-form';
import { MachineTable } from '@/features/machines/components/machine-table';
import type { ClientMachine, MachineType } from '@/types/machine';

export function ClientMachinesTab({
  clientId,
  initialMachines,
  machineTypes
}: {
  clientId: string;
  initialMachines: ClientMachine[];
  machineTypes: MachineType[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingMachine, setEditingMachine] = useState<ClientMachine | null>(null);
  const [changingFilterMachine, setChangingFilterMachine] = useState<ClientMachine | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [machines, setMachines] = useState(initialMachines);

  const onRemove = (machine: ClientMachine) => {
    startTransition(async () => {
      await removeClientMachine(clientId, machine.id);
      setMachines((current) => current.filter((item) => item.id !== machine.id));
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-600">Parc machines client, suivi des filtres et maintenance.</p>
        <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={() => setIsAdding((value) => !value)}>
          {isAdding ? 'Fermer' : 'Ajouter machine'}
        </button>
      </div>

      {isAdding ? (
        <MachineForm
          clientId={clientId}
          machineTypes={machineTypes}
          onDone={() => {
            setIsAdding(false);
            router.refresh();
          }}
        />
      ) : null}
      {editingMachine ? (
        <MachineForm
          clientId={clientId}
          machineTypes={machineTypes}
          machine={editingMachine}
          onDone={() => {
            setEditingMachine(null);
            router.refresh();
          }}
        />
      ) : null}
      {changingFilterMachine ? (
        <ChangeFilterDialog
          clientId={clientId}
          machine={changingFilterMachine}
          onClose={() => setChangingFilterMachine(null)}
          onChanged={(payload) => {
            setMachines((current) =>
              current.map((item) =>
                item.id === payload.id
                  ? {
                      ...item,
                      lastFilterChangeDate: payload.lastFilterChangeDate,
                      nextFilterChangeDate: payload.nextFilterChangeDate
                    }
                  : item
              )
            );
          }}
        />
      ) : null}

      {isPending ? <p className="text-sm text-slate-500">Mise à jour en cours...</p> : null}
      <MachineTable machines={machines} onEdit={setEditingMachine} onRemove={onRemove} onChangeFilter={setChangingFilterMachine} />
    </div>
  );
}
