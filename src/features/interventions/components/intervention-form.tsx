'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { createIntervention } from '@/features/interventions/actions';
import { interventionFormSchema, type InterventionFormValues } from '@/features/interventions/schemas';
import { interventionStatusValues, interventionTypeValues } from '@/types/intervention';

const interventionTypeLabels: Record<(typeof interventionTypeValues)[number], string> = {
  depannage: 'Dépannage',
  maintenance: 'Maintenance',
  controle: 'Contrôle',
  installation: 'Installation',
  autre: 'Autre'
};

const interventionStatusLabels: Record<(typeof interventionStatusValues)[number], string> = {
  planned: 'Planifiée',
  in_progress: 'En cours',
  done: 'Terminée',
  cancelled: 'Annulée'
};

export function InterventionForm({
  clients,
  machines,
  technicians
}: {
  clients: Array<{ id: string; name: string }>;
  machines: Array<{ id: string; clientId: string; label: string }>;
  technicians: Array<{ id: string; label: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: {
      interventionDate: new Date().toISOString().slice(0, 10),
      type: 'depannage',
      status: 'done'
    }
  });

  const selectedClientId = watch('clientId');
  const filteredMachines = useMemo(() => machines.filter((machine) => machine.clientId === selectedClientId), [machines, selectedClientId]);

  const onSubmit = (values: InterventionFormValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await createIntervention(values);
        reset({
          interventionDate: new Date().toISOString().slice(0, 10),
          type: 'depannage',
          status: 'done'
        });
        router.refresh();
      } catch {
        setErrorMessage('Impossible d’enregistrer l’intervention. Vérifiez la configuration de la table Supabase.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('clientId')}>
          <option value="">Client concerné</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('machineId')}>
          <option value="">Machine (optionnel)</option>
          {filteredMachines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.label}
            </option>
          ))}
        </select>

        <select className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('technicianUserId')}>
          <option value="">Technicien assigné (optionnel)</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.label}
            </option>
          ))}
        </select>

        <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nom du technicien (optionnel)" {...register('technicianName')} />

        <input type="date" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('interventionDate')} />
        <div className="grid grid-cols-2 gap-2">
          <input type="time" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('startTime')} />
          <input type="time" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" {...register('endTime')} />
        </div>

        <select className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('type')}>
          {interventionTypeValues.map((value) => (
            <option key={value} value={value}>
              {interventionTypeLabels[value]}
            </option>
          ))}
        </select>

        <select className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm" {...register('status')}>
          {interventionStatusValues.map((value) => (
            <option key={value} value={value}>
              {interventionStatusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Titre court de l’intervention" {...register('title')} />
      <textarea className="min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Description détaillée" {...register('description')} />
      <textarea className="min-h-16 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Diagnostic / cause" {...register('diagnosis')} />
      <textarea className="min-h-16 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Action effectuée" {...register('actionTaken')} />
      <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Chemin photo / référence pièce jointe" {...register('photoPath')} />
      <textarea className="min-h-16 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Notes complémentaires" {...register('notes')} />

      {Object.keys(errors).length ? <p className="text-xs text-rose-600">Merci de corriger les champs du formulaire.</p> : null}
      {errorMessage ? <p className="text-xs text-rose-600">{errorMessage}</p> : null}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? 'Enregistrement...' : 'Enregistrer l’intervention'}
      </Button>
    </form>
  );
}
