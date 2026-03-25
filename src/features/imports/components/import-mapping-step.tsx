'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { fieldSets } from '@/features/imports/helpers';
import { type ImportEntity, type ImportMappingValues } from '@/features/imports/schemas';

type ImportMappingStepProps = {
  entity: ImportEntity;
  headers: string[];
  defaultMapping: Record<string, string | null>;
  onConfirm: (mapping: ImportMappingValues) => void;
};

const mappingFormSchema = z.object({
  fieldToColumn: z.record(z.string(), z.string().nullable())
});

type MappingFormValues = z.infer<typeof mappingFormSchema>;

export function ImportMappingStep({ entity, headers, defaultMapping, onConfirm }: ImportMappingStepProps) {
  const fields = fieldSets[entity];

  const { register, handleSubmit } = useForm<MappingFormValues>({
    resolver: zodResolver(mappingFormSchema),
    defaultValues: { fieldToColumn: defaultMapping }
  });

  return (
    <form
      className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
      onSubmit={handleSubmit((values) => onConfirm({ entity, fieldToColumn: values.fieldToColumn }))}
    >
      <h3 className="text-sm font-semibold text-slate-900">Mapping colonnes</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="space-y-1 text-sm">
            <span className="text-slate-700">
              {field.label}
              {field.required ? ' *' : ''}
            </span>
            <select className="w-full rounded border border-slate-300 bg-white px-2 py-2" {...register(`fieldToColumn.${field.key}`)}>
              <option value="">-- non mappé --</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
        Valider le mapping
      </button>
    </form>
  );
}
