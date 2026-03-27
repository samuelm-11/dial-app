'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createOpportunity, updateOpportunity } from '@/features/opportunities/actions';
import { opportunityFormSchema, type OpportunityFormValues, opportunityPriorityValues, opportunityStatusValues } from '@/features/opportunities/schemas';
import type { Opportunity } from '@/types/opportunity';

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
} as const;

export function OpportunityForm({
  clientId,
  opportunity,
  machineCategoryOptions,
  onDone
}: {
  clientId: string;
  machineCategoryOptions: Array<{ id: string; label: string }>;
  opportunity?: Opportunity;
  onDone?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: opportunity
      ? {
          clientId,
          title: opportunity.title,
          description: opportunity.description,
          linkedMachineCategoryId: opportunity.linkedMachineCategoryId,
          priority: opportunity.priority,
          status: opportunity.status,
          estimatedValue: opportunity.estimatedValue,
          probability: opportunity.probability
        }
      : {
          clientId,
          status: 'open',
          priority: 'medium'
        }
  });

  const onSubmit = (values: OpportunityFormValues) => {
    startTransition(async () => {
      if (opportunity) {
        await updateOpportunity(clientId, opportunity.id, values);
      } else {
        await createOpportunity(values);
        reset({
          clientId,
          title: '',
          description: '',
          linkedMachineCategoryId: null,
          priority: 'medium',
          status: 'open',
          estimatedValue: null,
          probability: null
        });
      }

      onDone?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Titre de l'opportunité" {...register('title')} />
        <textarea className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Description" {...register('description')} />

        <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('linkedMachineCategoryId')}>
          <option value="">Catégorie machine liée (optionnel)</option>
          {machineCategoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('priority')}>
          {opportunityPriorityValues.map((value) => (
            <option key={value} value={value}>
              Priorité: {priorityLabels[value]}
            </option>
          ))}
        </select>

        <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('status')}>
          {opportunityStatusValues.map((value) => (
            <option key={value} value={value}>
              Statut: {value}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          step="100"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Valeur estimée (€)"
          {...register('estimatedValue', { valueAsNumber: true })}
        />

        <input
          type="number"
          min={0}
          max={100}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Probabilité (%)"
          {...register('probability', { valueAsNumber: true })}
        />
      </div>

      {Object.keys(errors).length > 0 ? <p className="text-xs text-rose-600">Merci de corriger les champs opportunité.</p> : null}

      <button className="w-full rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60 sm:w-auto" disabled={isPending}>
        {isPending ? 'Enregistrement...' : opportunity ? "Mettre à jour l'opportunité" : 'Créer une opportunité'}
      </button>
    </form>
  );
}
