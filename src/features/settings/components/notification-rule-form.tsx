'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { upsertNotificationRule } from '@/features/settings/actions';
import { notificationRuleSchema, type NotificationRuleValues } from '@/features/settings/schemas';
import type { NotificationRuleSetting } from '@/types/settings';

const notificationTypeOptions: Array<{ value: 'contract_end' | 'filter_change'; label: string }> = [
  { value: 'contract_end', label: 'Fin de contrat' },
  { value: 'filter_change', label: 'Changement filtre' }
];

export function NotificationRuleForm({ rule }: { rule?: NotificationRuleSetting }) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<NotificationRuleValues>({
    resolver: zodResolver(notificationRuleSchema),
    defaultValues: rule
      ? {
          code: rule.code,
          label: rule.label,
          daysBeforeDue: rule.daysBeforeDue,
          notificationType: rule.notificationType,
          isActive: rule.isActive
        }
      : {
          code: 'contract_end_6m',
          label: 'Fin de contrat à 6 mois',
          daysBeforeDue: 180,
          notificationType: 'contract_end',
          isActive: true
        }
  });

  const onSubmit = (values: NotificationRuleValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await upsertNotificationRule(rule?.id ?? null, values);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 rounded border border-slate-200 p-3">
      <div className="grid gap-2 md:grid-cols-6">
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('code')}>
          <option value="contract_end_6m">Contrat - 6 mois</option>
          <option value="contract_end_3m">Contrat - 3 mois</option>
          <option value="contract_end_1m">Contrat - 1 mois</option>
          <option value="filter_change_due">Filtre - à échéance</option>
          <option value="filter_change_30d">Filtre - 30 jours</option>
        </select>
        <input className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Libellé" {...register('label')} />
        <input
          type="number"
          min={0}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Jours avant échéance"
          {...register('daysBeforeDue', { valueAsNumber: true })}
        />
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('notificationType')}>
          {notificationTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm">
            <input type="checkbox" className="mr-2" {...register('isActive')} />Active
          </label>
          <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
            {rule ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
