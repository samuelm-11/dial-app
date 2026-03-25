'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createContract, updateContract } from '@/features/contracts/actions';
import { contractFormSchema, type ContractFormValues } from '@/features/contracts/schemas';
import type { Contract } from '@/types/contract';

export function ContractForm({ clientId, contract, onDone }: { clientId: string; contract?: Contract; onDone?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: contract
      ? {
          clientId,
          title: contract.title,
          startDate: contract.startDate,
          endDate: contract.endDate,
          autoRenewal: contract.autoRenewal
        }
      : {
          clientId,
          autoRenewal: false
        }
  });

  const onSubmit = (values: ContractFormValues) => {
    startTransition(async () => {
      if (contract) {
        await updateContract(clientId, contract.id, values);
      } else {
        await createContract(values);
      }
      router.refresh();
      onDone?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" {...register('clientId')} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Titre du contrat" {...register('title')} />
        <label className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" {...register('autoRenewal')} />
          Auto-renouvellement
        </label>

        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('startDate')} />
        <input type="date" className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('endDate')} />
      </div>

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de vérifier les champs contrat.</p> : null}

      <button disabled={isPending} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">
        {isPending ? 'Enregistrement...' : contract ? 'Mettre à jour le contrat' : 'Ajouter le contrat'}
      </button>
    </form>
  );
}
