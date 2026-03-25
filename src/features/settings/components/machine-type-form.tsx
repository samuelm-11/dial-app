'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { upsertMachineType } from '@/features/settings/actions';
import { machineTypeSchema, type MachineTypeValues } from '@/features/settings/schemas';
import type { MachineCategorySetting, MachineTypeSetting } from '@/types/settings';

export function MachineTypeForm({ machineType, categories }: { machineType?: MachineTypeSetting; categories: MachineCategorySetting[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, control, handleSubmit } = useForm<MachineTypeValues>({
    resolver: zodResolver(machineTypeSchema),
    defaultValues: machineType
      ? {
          machineCategoryId: machineType.machineCategoryId,
          code: machineType.code,
          label: machineType.label,
          requiresFilterChange: machineType.requiresFilterChange,
          filterLifespanDays: machineType.filterLifespanDays,
          isActive: machineType.isActive
        }
      : { requiresFilterChange: false, isActive: true }
  });
  const requiresFilterChange = useWatch({ control, name: 'requiresFilterChange' });

  const onSubmit = (values: MachineTypeValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await upsertMachineType(machineType?.id ?? null, values);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 rounded border border-slate-200 p-3">
      <div className="grid gap-2 md:grid-cols-6">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('machineCategoryId')}>
          <option value="">Catégorie</option>
          {categories.filter((item) => item.isActive).map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Code" {...register('code')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Libellé" {...register('label')} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('requiresFilterChange')} />Changement filtre
        </label>
        <input
          type="number"
          min={1}
          disabled={!requiresFilterChange}
          className="rounded border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          placeholder="Durée filtre (jours)"
          {...register('filterLifespanDays', { valueAsNumber: true })}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm">
            <input type="checkbox" className="mr-2" {...register('isActive')} />Active
          </label>
          <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
            {machineType ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
