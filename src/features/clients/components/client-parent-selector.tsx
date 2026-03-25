import type { FieldError, UseFormRegister } from 'react-hook-form';
import type { ClientFormValues } from '@/features/clients/schemas';

export function ClientParentSelector({
  options,
  register,
  error
}: {
  options: Array<{ id: string; name: string }>;
  register: UseFormRegister<ClientFormValues>;
  error?: FieldError;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Client parent</label>
      <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('parentClientId')}>
        <option value="">Aucun parent</option>
        {options.map((parent) => (
          <option key={parent.id} value={parent.id}>
            {parent.name}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-rose-600">{error.message}</p> : null}
    </div>
  );
}
