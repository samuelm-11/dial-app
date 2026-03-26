'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from '@/features/auth/validation';
import { useState } from 'react';
import { loginAction } from '@/features/auth/actions/auth-actions';

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setIsLoading(true);

    // Server Action — les cookies sont écrits côté serveur,
    // ce qui garantit que le middleware SSR les voit immédiatement.
    const result = await loginAction(values.email, values.password);

    // Si on arrive ici, c'est qu'il y a eu une erreur (loginAction redirige en cas de succès)
    setIsLoading(false);
    if (result?.error) {
      setServerError(result.error);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Connexion</h1>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" className="w-full rounded border px-3 py-2" {...form.register('email')} />
        {form.formState.errors.email && <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
        <input id="password" type="password" className="w-full rounded border px-3 py-2" {...form.register('password')} />
        {form.formState.errors.password && <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>}
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        disabled={isLoading}
        type="submit"
        className="w-full rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
