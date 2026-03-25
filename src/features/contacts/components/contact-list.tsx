'use client';

import { useState, useTransition } from 'react';
import { deleteContact, setPrimaryContact } from '@/features/contacts/actions';
import { ContactForm } from '@/features/contacts/components/contact-form';
import type { Contact } from '@/types/contact';

export function ContactList({ contacts, clientId }: { contacts: Contact[]; clientId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {contacts.length === 0 ? <p className="text-sm text-slate-500">Aucun contact enregistré pour ce client.</p> : null}
      {contacts.map((contact) => (
        <div key={contact.id} className="rounded border border-slate-200 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">
                {contact.firstName} {contact.lastName}{' '}
                {contact.isPrimary ? <span className="text-xs text-emerald-700">(Principal)</span> : null}
              </p>
              <p className="text-sm text-slate-600">{contact.email ?? 'Email non renseigné'}</p>
              <p className="text-sm text-slate-600">{contact.phone ?? 'Téléphone non renseigné'}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="rounded border px-2 py-1" onClick={() => setEditingId(contact.id)}>
                Modifier
              </button>
              <button
                className="rounded border px-2 py-1"
                onClick={() =>
                  startTransition(async () => {
                    await setPrimaryContact(contact.id, clientId);
                  })
                }
                disabled={isPending}
              >
                Définir principal
              </button>
              <button
                className="rounded border border-rose-200 px-2 py-1 text-rose-700"
                onClick={() =>
                  startTransition(async () => {
                    await deleteContact(contact.id, clientId);
                  })
                }
                disabled={isPending}
              >
                Supprimer
              </button>
            </div>
          </div>
          {editingId === contact.id ? (
            <div className="mt-3">
              <ContactForm clientId={clientId} contact={contact} onDone={() => setEditingId(null)} />
            </div>
          ) : null}
        </div>
      ))}

      <ContactForm clientId={clientId} />
    </div>
  );
}
