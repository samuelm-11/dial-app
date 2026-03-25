'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { upsertMachineType } from '@/features/machines/actions';
import { machineTypeSchema, type MachineTypeValues } from '@/features/machines/schemas';
import type { MachineCategory, MachineType } from '@/types/machine';

export function MachineTypeForm({ machineType, categories }: { machineType?: MachineType; categories: MachineCategory[] }) {
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      await upsertMachineType(machineType?.id ?? null, values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 rounded border border-slate-200 p-3 md:grid-cols-6">
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
        <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
          {machineType ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
