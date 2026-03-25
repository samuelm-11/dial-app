'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/validation';

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setStatus(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('Si ce compte existe, un email de récupération a été envoyé.');
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" className="w-full rounded border px-3 py-2" {...form.register('email')} />
        {form.formState.errors.email && <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>}
      </div>
      {status && <p className="text-sm text-slate-600">{status}</p>}
      <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-white">Envoyer</button>
    </form>
  );
}
