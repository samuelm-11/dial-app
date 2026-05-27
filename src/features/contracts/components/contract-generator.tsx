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
      templateId: templates[0]?.id,
      title: `Contrat - ${client.name}`,
      autoRenewal: false,
      serviceLevel: 'Réassort et maintenance préventive des distributeurs',
      monthlyFee: 'À compléter',
      billingFrequency: 'Facturation mensuelle',
      paymentTerms: 'Paiement à 30 jours date de facture',
      contractDuration: '12 mois renouvelables'
    }
  });

  const selectedTemplateId = watch('templateId');
  const startDate = watch('startDate') ?? '';
  const endDate = watch('endDate') ?? '';
  const details = {
    serviceLevel: watch('serviceLevel') ?? '',
    monthlyFee: watch('monthlyFee') ?? '',
    billingFrequency: watch('billingFrequency') ?? '',
    paymentTerms: watch('paymentTerms') ?? '',
    contractDuration: watch('contractDuration') ?? '',
    specialConditions: watch('specialConditions') ?? ''
  };
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
  const preview = useMemo(() => {
    if (!selectedTemplate) {
      return 'Sélectionnez un modèle pour afficher l’aperçu.';
    }

    return renderContractTemplate(selectedTemplate.content, { client, startDate, endDate, details });
  }, [client, details.billingFrequency, details.contractDuration, details.monthlyFee, details.paymentTerms, details.serviceLevel, details.specialConditions, endDate, selectedTemplate, startDate]);

  const onSubmit = (values: GenerateContractValues) => {
    startTransition(async () => {
      await generateContractFromTemplate(values);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-900">Générer un contrat standard</h3>
        <p className="text-xs text-slate-500">Les informations client sont injectées automatiquement. Seules les conditions commerciales restent modifiables.</p>
      </div>

      <input type="hidden" {...register('clientId')} />

      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('templateId')} disabled={templates.length === 0}>
          <option value="">{templates.length === 0 ? 'Aucun modèle disponible' : 'Modèle de contrat type'}</option>
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

      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Formule de service" {...register('serviceLevel')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Montant mensuel" {...register('monthlyFee')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Facturation" {...register('billingFrequency')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Paiement" {...register('paymentTerms')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Durée du contrat" {...register('contractDuration')} />
        <textarea
          className="min-h-20 rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          placeholder="Conditions particulières visibles dans le contrat"
          {...register('specialConditions')}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register('autoRenewal')} />
        Auto-renouvellement
      </label>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mx-auto min-h-[640px] max-w-[794px] whitespace-pre-wrap rounded border border-slate-200 bg-white px-8 py-10 text-sm leading-7 text-slate-800 shadow-sm">
          {preview}
        </div>
      </div>

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de vérifier les champs avant génération.</p> : null}

      <div className="flex flex-wrap gap-2">
        <button disabled={isPending || templates.length === 0} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
          {isPending ? 'Génération...' : 'Générer le contrat'}
        </button>
        <button type="button" onClick={() => window.print()} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          Imprimer / PDF
        </button>
      </div>
    </form>
  );
}
