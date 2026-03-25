'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createContact, updateContact } from '@/features/contacts/actions';
import { createContactSchema, type CreateContactValues } from '@/features/contacts/schemas';
import type { Contact } from '@/types/contact';

export function ContactForm({
  clientId,
  contact,
  onDone
}: {
  clientId: string;
  contact?: Contact;
  onDone?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateContactValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          role: contact.role,
          isPrimary: contact.isPrimary
        }
      : { role: 'manager', isPrimary: false }
  });

  const submit = (values: CreateContactValues) => {
    startTransition(async () => {
      if (contact) {
        await updateContact(contact.id, clientId, values);
      } else {
        await createContact(clientId, values);
        reset({ firstName: '', lastName: '', email: '', phone: '', role: 'manager', isPrimary: false });
      }
      onDone?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Prénom" {...register('firstName')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nom" {...register('lastName')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Email" {...register('email')} />
        <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Téléphone" {...register('phone')} />
        <select className="rounded border border-slate-300 px-3 py-2 text-sm" {...register('role')}>
          <option value="manager">Décideur</option>
          <option value="billing">Facturation</option>
          <option value="technical">Technique</option>
          <option value="other">Autre</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('isPrimary')} /> Contact principal
        </label>
      </div>

      {(errors.firstName || errors.lastName || errors.email || errors.phone) && (
        <p className="text-xs text-rose-600">Vérifiez les informations de contact saisies.</p>
      )}

      <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" disabled={isPending}>
        {isPending ? 'Enregistrement...' : contact ? 'Mettre à jour le contact' : 'Ajouter le contact'}
      </button>
    </form>
  );
}
