'use client';

import { useMemo, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createOpportunity, updateOpportunity } from '@/features/opportunities/actions';
import {
  opportunityFormSchema,
  type OpportunityFormValues,
  opportunityPriorityValues,
  opportunityStatusValues
} from '@/features/opportunities/schemas';
import type { CompetitorCategory, Opportunity } from '@/types/opportunity';

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
} as const;

const competitorCategoryLabels: Record<CompetitorCategory, string> = {
  hot_drinks: 'Café / boisson chaude',
  snacking: 'Snack / confiserie',
  sandwich_catering: 'Sandwich / traiteur',
  cold_drinks: 'Boisson froide',
  water_fountain: 'Fontaine à eau',
  other: 'Autre'
};

export function OpportunityForm({
  clientId,
  clientName,
  opportunity,
  machineCategoryOptions,
  onDone
}: {
  clientId?: string;
  clientName?: string;
  machineCategoryOptions: Array<{ id: string; label: string }>;
  opportunity?: Opportunity;
  onDone?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [machineCategoryKey, setMachineCategoryKey] = useState<string>('');
  const [machineCategoryValue, setMachineCategoryValue] = useState<string>('0');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: opportunity
      ? {
          clientId: opportunity.clientId,
          prospectName: opportunity.prospectName,
          prospectContactName: opportunity.prospectContactName,
          prospectEmail: opportunity.prospectEmail,
          prospectPhone: opportunity.prospectPhone,
          prospectAddress: opportunity.prospectAddress,
          prospectPostalCode: opportunity.prospectPostalCode,
          prospectCity: opportunity.prospectCity,
          prospectCountry: opportunity.prospectCountry,
          title: opportunity.title,
          description: opportunity.description,
          linkedMachineCategoryId: opportunity.linkedMachineCategoryId,
          priority: opportunity.priority,
          status: opportunity.status,
          estimatedValue: opportunity.estimatedValue,
          probability: opportunity.probability,
          yearlyRevenue: opportunity.yearlyRevenue,
          employeeCount: opportunity.employeeCount,
          totalMachineCount: opportunity.totalMachineCount,
          machineCountsByCategory: opportunity.machineCountsByCategory,
          incumbentCompetitorName: opportunity.incumbentCompetitorName,
          incumbentCompetitorCategory: opportunity.incumbentCompetitorCategory,
          competitorContractEndDate: opportunity.competitorContractEndDate,
          notes: opportunity.notes
        }
      : {
          clientId: clientId ?? null,
          prospectName: clientName ?? '',
          prospectCountry: 'Belgique',
          status: 'open',
          priority: 'medium',
          machineCountsByCategory: {}
        }
  });

  const machineCountsByCategory = watch('machineCountsByCategory') ?? {};
  const machineCountEntries = useMemo(
    () => Object.entries(machineCountsByCategory).sort((a, b) => a[0].localeCompare(b[0], 'fr')),
    [machineCountsByCategory]
  );

  const onSubmit = (values: OpportunityFormValues) => {
    startTransition(async () => {
      const cleanValues = {
        ...values,
        machineCountsByCategory: values.machineCountsByCategory ?? {}
      };

      if (opportunity) {
        await updateOpportunity(opportunity.id, cleanValues);
      } else {
        await createOpportunity(cleanValues);
        reset({
          clientId: clientId ?? null,
          prospectName: clientName ?? '',
          prospectContactName: '',
          prospectEmail: '',
          prospectPhone: '',
          prospectAddress: '',
          prospectPostalCode: '',
          prospectCity: '',
          prospectCountry: 'Belgique',
          title: '',
          description: '',
          linkedMachineCategoryId: null,
          priority: 'medium',
          status: 'open',
          estimatedValue: null,
          probability: null,
          yearlyRevenue: null,
          employeeCount: null,
          totalMachineCount: null,
          machineCountsByCategory: {},
          incumbentCompetitorName: '',
          incumbentCompetitorCategory: null,
          competitorContractEndDate: null,
          notes: ''
        });
      }

      onDone?.();
    });
  };

  const addMachineCategoryCount = () => {
    const normalizedKey = machineCategoryKey.trim();
    const count = Number(machineCategoryValue);

    if (!normalizedKey || Number.isNaN(count) || count < 0) {
      return;
    }

    setValue(
      'machineCountsByCategory',
      {
        ...machineCountsByCategory,
        [normalizedKey]: Math.round(count)
      },
      { shouldDirty: true, shouldValidate: true }
    );

    setMachineCategoryKey('');
    setMachineCategoryValue('0');
  };

  const removeMachineCategoryCount = (key: string) => {
    const next = { ...machineCountsByCategory };
    delete next[key];
    setValue('machineCountsByCategory', next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4">
      {clientId ? <input type="hidden" {...register('clientId')} /> : null}

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Prospect</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Nom du prospect / société"
            {...register('prospectName')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Contact"
            {...register('prospectContactName')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Email"
            {...register('prospectEmail')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Téléphone"
            {...register('prospectPhone')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Code postal"
            {...register('prospectPostalCode')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Ville"
            {...register('prospectCity')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Pays"
            {...register('prospectCountry')}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Adresse"
            {...register('prospectAddress')}
          />
        </div>
        {errors.prospectName?.message ? <p className="text-xs text-rose-600">{errors.prospectName.message}</p> : null}
        {errors.prospectEmail?.message ? <p className="text-xs text-rose-600">{errors.prospectEmail.message}</p> : null}
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Informations générales</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Titre de la prospection" {...register('title')} />
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
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Données business</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input type="number" min={0} step="1000" className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="CA annuel (€)" {...register('yearlyRevenue', { valueAsNumber: true })} />
          <input type="number" min={0} className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nombre de salariés" {...register('employeeCount', { valueAsNumber: true })} />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Environnement installé / parc machines</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input type="number" min={0} className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nombre total de machines" {...register('totalMachineCount', { valueAsNumber: true })} />
          <div className="rounded border border-slate-200 bg-white p-3 md:col-span-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-600">Machines par type / catégorie</p>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <input
                className="rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Ex: Boisson chaude"
                value={machineCategoryKey}
                onChange={(event) => setMachineCategoryKey(event.target.value)}
              />
              <input
                type="number"
                min={0}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
                value={machineCategoryValue}
                onChange={(event) => setMachineCategoryValue(event.target.value)}
              />
              <button type="button" className="rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={addMachineCategoryCount}>
                Ajouter
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {machineCountEntries.length === 0 ? <p className="text-xs text-slate-500">Aucune catégorie renseignée.</p> : null}
              {machineCountEntries.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm">
                  <span>
                    {key}: <strong>{value}</strong>
                  </span>
                  <button type="button" className="text-xs text-rose-600" onClick={() => removeMachineCategoryCount(key)}>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Données concurrentielles</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Concurrent en place"
            {...register('incumbentCompetitorName')}
          />
          <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('incumbentCompetitorCategory')}>
            <option value="">Position occupée (optionnel)</option>
            {Object.entries(competitorCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('competitorContractEndDate')} />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Notes</h4>
        <textarea className="w-full rounded border border-slate-300 px-3 py-2 text-sm" rows={4} placeholder="Notes commerciales, observations terrain, contraintes..." {...register('notes')} />
      </section>

      {Object.keys(errors).length > 0 ? <p className="text-xs text-rose-600">Merci de corriger les champs de prospection.</p> : null}

      <button className="w-full rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60 sm:w-auto" disabled={isPending}>
        {isPending ? 'Enregistrement...' : opportunity ? 'Mettre à jour la prospection' : 'Créer une prospection'}
      </button>
    </form>
  );
}
