'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { inviteUserPlaceholder } from '@/features/users/actions';
import { inviteUserSchema, type InviteUserValues } from '@/features/users/schemas';

export function UserInviteForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<InviteUserValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (values: InviteUserValues) => {
    setMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await inviteUserPlaceholder(values);
        reset();
        setMessage('Invitation en attente: le flux email sera connecté dans une prochaine étape.');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded border border-dashed border-slate-300 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-700">Inviter un utilisateur</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="email"
          placeholder="nouvel.utilisateur@entreprise.fr"
          className="w-full rounded border border-slate-300 px-2 py-1 text-xs sm:max-w-xs"
          {...register('email')}
          disabled={isPending}
        />
        <button type="submit" className="w-full rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white disabled:opacity-60 sm:w-auto" disabled={isPending}>
          Préparer l'invitation
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-amber-700">{message}</p> : null}
      {errorMessage ? <p className="mt-2 text-xs text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
