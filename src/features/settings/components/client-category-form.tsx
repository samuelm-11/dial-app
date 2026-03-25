'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { upsertClientCategory } from '@/features/settings/actions';
import { clientCategorySchema, type ClientCategoryValues } from '@/features/settings/schemas';
import type { ClientCategorySetting } from '@/types/settings';

export function ClientCategoryForm({ category }: { category?: ClientCategorySetting }) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ClientCategoryValues>({
    resolver: zodResolver(clientCategorySchema),
    defaultValues: category ? { code: category.code, label: category.label, isActive: category.isActive } : { isActive: true }
  });

  const onSubmit = (values: ClientCategoryValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await upsertClientCategory(category?.id ?? null, values);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 rounded border border-slate-200 p-3">
      <div className="grid gap-2 md:grid-cols-4">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Code" {...register('code')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Libellé" {...register('label')} />
        <div className="flex items-center gap-2">
          <label className="text-sm">
            <input type="checkbox" className="mr-2" {...register('isActive')} />Active
          </label>
          <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
            {category ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
