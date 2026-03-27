'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/features/users/actions';
import { userUpdateSchema, type UserUpdateValues } from '@/features/users/schemas';
import type { UserListItem } from '@/types/user';

type UserFormProps = {
  user: UserListItem;
  isCurrentUser: boolean;
};

export function UserForm({ user, isCurrentUser }: UserFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      role: user.role,
      isActive: user.isActive
    }
  });

  const onSubmit = (values: UserUpdateValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await updateUser(user.id, values);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select className="w-full rounded border border-slate-300 px-2 py-1 text-xs sm:w-auto" {...register('role')} disabled={isPending}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Lecture</option>
        </select>
        <label className="text-xs text-slate-700">
          <input type="checkbox" className="mr-1" {...register('isActive')} disabled={isPending || isCurrentUser} />
          Actif
        </label>
        <button type="submit" className="w-full rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-60 sm:w-auto" disabled={isPending}>
          Enregistrer
        </button>
      </div>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
