'use client';

import { useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClient, updateClient } from '@/features/clients/actions';
import { clientCategoryLabels, clientFlagLabels } from '@/features/clients/helpers';
import { clientFormSchema, type ClientFormValues } from '@/features/clients/schemas';
import { ClientParentSelector } from '@/features/clients/components/client-parent-selector';

export function ClientForm({
  mode,
  clientId,
  defaultValues,
  parentOptions
}: {
  mode: 'create' | 'edit';
  clientId?: string;
  defaultValues?: Partial<ClientFormValues>;
  parentOptions: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      category: 'sme',
      flag: 'none',
      country: 'France',
      ...defaultValues
    }
  });

  const onSubmit = (values: ClientFormValues) => {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createClient(values);
        } else if (clientId) {
          await updateClient(clientId, values);
        }
        router.push('/clients');
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom" error={errors.name?.message}>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('name')} />
        </Field>

        <ClientParentSelector options={parentOptions} register={register} error={errors.parentClientId} />

        <Field label="Catégorie" error={errors.category?.message}>
          <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('category')}>
            {Object.entries(clientCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Flag" error={errors.flag?.message}>
          <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('flag')}>
            {Object.entries(clientFlagLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Adresse" error={errors.address?.message}>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('address')} />
        </Field>

        <Field label="Code postal" error={errors.postalCode?.message}>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('postalCode')} />
        </Field>

        <Field label="Ville" error={errors.city?.message}>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('city')} />
        </Field>

        <Field label="Pays" error={errors.country?.message}>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('country')} />
        </Field>

        <Field label="Date installation" error={errors.installationDate?.message}>
          <input type="date" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('installationDate')} />
        </Field>
      </div>

      <Field label="Notes amélioration" error={errors.improvementNotes?.message}>
        <textarea className="w-full rounded border border-slate-300 px-3 py-2 text-sm" rows={3} {...register('improvementNotes')} />
      </Field>

      <Field label="Notes internes" error={errors.internalNotes?.message}>
        <textarea className="w-full rounded border border-slate-300 px-3 py-2 text-sm" rows={3} {...register('internalNotes')} />
      </Field>

      {mode === 'create' ? (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold">Contact principal initial</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Prénom" error={errors.initialPrimaryContact?.firstName?.message}>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                {...register('initialPrimaryContact.firstName')}
              />
            </Field>
            <Field label="Nom" error={errors.initialPrimaryContact?.lastName?.message}>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                {...register('initialPrimaryContact.lastName')}
              />
            </Field>
            <Field label="Email" error={errors.initialPrimaryContact?.email?.message}>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                {...register('initialPrimaryContact.email')}
              />
            </Field>
            <Field label="Téléphone" error={errors.initialPrimaryContact?.phone?.message}>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                {...register('initialPrimaryContact.phone')}
              />
            </Field>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <button type="button" className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={() => router.back()}>
          Annuler
        </button>
        <button type="submit" disabled={isPending} className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60">
          {isPending ? 'Enregistrement...' : mode === 'create' ? 'Créer le client' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
