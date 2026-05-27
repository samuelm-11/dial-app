'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createContractTemplate, updateContractTemplate } from '@/features/contracts/actions';
import { contractTemplateSchema, type ContractTemplateValues } from '@/features/contracts/schemas';
import { contractTemplateVariables } from '@/features/contracts/templates/render-template';
import type { ContractTemplate } from '@/types/contract';

export function ContractTemplateForm({ template }: { template?: ContractTemplate }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContractTemplateValues>({
    resolver: zodResolver(contractTemplateSchema),
    defaultValues: template
      ? {
          name: template.name,
          description: template.description ?? '',
          content: template.content,
          isActive: template.isActive
        }
      : {
          isActive: true,
          content: defaultTemplateContent
        }
  });

  const onSubmit = (values: ContractTemplateValues) => {
    startTransition(async () => {
      if (template) {
        await updateContractTemplate(template.id, values);
      } else {
        await createContractTemplate(values);
      }
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nom du modèle" {...register('name')} />
        <label className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" {...register('isActive')} />
          Modèle actif
        </label>
      </div>

      <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Description courte" {...register('description')} />

      <textarea
        className="min-h-80 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm leading-6"
        placeholder="Texte du contrat avec variables"
        {...register('content')}
      />

      <div className="rounded border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Variables disponibles</p>
        <div className="flex flex-wrap gap-2">
          {contractTemplateVariables.map((variable) => (
            <code key={variable.key} className="rounded bg-white px-2 py-1 text-xs text-slate-700">
              {'{{'}
              {variable.key}
              {'}}'}
            </code>
          ))}
        </div>
      </div>

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de vérifier le modèle de contrat.</p> : null}

      <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
        {isPending ? 'Enregistrement...' : template ? 'Mettre à jour le modèle' : 'Créer le modèle'}
      </button>
    </form>
  );
}

const defaultTemplateContent = `CONTRAT DE SERVICE

Entre Dial, prestataire de distribution automatique en région liégeoise,
et {{client.nom}}, situé {{client.adresse}}, {{client.code_postal}} {{client.ville}}, {{client.pays}}.

Contact principal: {{contact.nom}}
Email: {{contact.email}}
Téléphone: {{contact.telephone}}

Le présent contrat prend effet le {{contrat.date_debut}} et se termine le {{contrat.date_fin}}.

Fait à Liège, le {{date}}.
`;
