'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { upsertMachineCategory } from '@/features/machines/actions';
import { machineCategorySchema, type MachineCategoryValues } from '@/features/machines/schemas';
import type { MachineCategory } from '@/types/machine';

export function MachineCategoryForm({ category }: { category?: MachineCategory }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<MachineCategoryValues>({
    resolver: zodResolver(machineCategorySchema),
    defaultValues: category
      ? { code: category.code, label: category.label, isActive: category.isActive }
      : { isActive: true }
  });

  const onSubmit = (values: MachineCategoryValues) => {
    startTransition(async () => {
      await upsertMachineCategory(category?.id ?? null, values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-2 rounded border border-slate-200 p-3">
      <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Code" {...register('code')} />
      <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Libellé" {...register('label')} />
      <label className="text-sm">
        <input type="checkbox" className="mr-2" {...register('isActive')} />Active
      </label>
      <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
        {category ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
}
