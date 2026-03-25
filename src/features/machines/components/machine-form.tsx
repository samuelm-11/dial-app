'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClientMachine, updateClientMachine } from '@/features/machines/actions';
import { createClientMachineSchema, type CreateClientMachineValues } from '@/features/machines/schemas';
import { machineStatusLabels } from '@/features/machines/helpers';
import type { ClientMachine, MachineType } from '@/types/machine';

export function MachineForm({
  clientId,
  machine,
  machineTypes,
  onDone
}: {
  clientId: string;
  machineTypes: MachineType[];
  machine?: ClientMachine;
  onDone?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateClientMachineValues>({
    resolver: zodResolver(createClientMachineSchema),
    defaultValues: machine
      ? {
          machineTypeId: machine.machineTypeId,
          quantity: machine.quantity,
          installationDate: machine.installationDate,
          status: machine.status,
          lastFilterChangeDate: machine.lastFilterChangeDate,
          notes: machine.notes
        }
      : { quantity: 1, status: 'active' }
  });

  const onSubmit = (values: CreateClientMachineValues) => {
    startTransition(async () => {
      if (machine) {
        await updateClientMachine(clientId, machine.id, values);
      } else {
        await createClientMachine(clientId, values);
      }
      onDone?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('machineTypeId')}>
          <option value="">Choisir un type machine</option>
          {machineTypes.filter((type) => type.isActive).map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Quantité"
          {...register('quantity', { valueAsNumber: true })}
        />

        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('installationDate')} />

        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('status')}>
          {Object.entries(machineStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('lastFilterChangeDate')} />
      </div>

      <textarea rows={2} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Notes" {...register('notes')} />

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de vérifier les champs machine.</p> : null}

      <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
        {isPending ? 'Enregistrement...' : machine ? 'Mettre à jour la machine' : 'Ajouter la machine'}
      </button>
    </form>
  );
}
