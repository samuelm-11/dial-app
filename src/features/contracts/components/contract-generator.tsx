'use client';

import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateContractFromTemplate } from '@/features/contracts/actions';
import { generateContractSchema, type GenerateContractValues } from '@/features/contracts/schemas';
import { renderContractTemplate } from '@/features/contracts/templates/render-template';
import type { ClientWithRelations } from '@/types/client';
import type { ContractTemplate } from '@/types/contract';

export function ContractGenerator({ client, templates }: { client: ClientWithRelations; templates: ContractTemplate[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<GenerateContractValues>({
    resolver: zodResolver(generateContractSchema),
    defaultValues: {
      clientId: client.id,
      title: `Contrat - ${client.name}`,
      autoRenewal: false
    }
  });

  const selectedTemplateId = watch('templateId');
  const startDate = watch('startDate') ?? '';
  const endDate = watch('endDate') ?? '';
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
  const preview = useMemo(() => {
    if (!selectedTemplate) {
      return 'Sélectionnez un modèle pour afficher l’aperçu.';
    }

    return renderContractTemplate(selectedTemplate.content, { client, startDate, endDate });
  }, [client, endDate, selectedTemplate, startDate]);

  const onSubmit = (values: GenerateContractValues) => {
    startTransition(async () => {
      await generateContractFromTemplate(values);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-900">Générer depuis un modèle</h3>
        <p className="text-xs text-slate-500">Les informations du client, de l’adresse et du contact principal sont injectées automatiquement.</p>
      </div>

      <input type="hidden" {...register('clientId')} />

      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('templateId')} disabled={templates.length === 0}>
          <option value="">{templates.length === 0 ? 'Aucun modèle disponible' : 'Choisir un modèle'}</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>

        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Titre du contrat" {...register('title')} />
        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('startDate')} />
        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('endDate')} />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register('autoRenewal')} />
        Auto-renouvellement
      </label>

      <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700">{preview}</pre>

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de vérifier les champs avant génération.</p> : null}

      <button disabled={isPending || templates.length === 0} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
        {isPending ? 'Génération...' : 'Générer le contrat'}
      </button>
    </form>
  );
}
