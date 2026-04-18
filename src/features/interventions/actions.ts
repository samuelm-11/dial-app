'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { interventionFormSchema } from '@/features/interventions/schemas';

export async function createIntervention(input: unknown) {
  const payload = interventionFormSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('interventions').insert({
    client_id: payload.clientId,
    machine_id: payload.machineId,
    technician_user_id: payload.technicianUserId,
    technician_name: payload.technicianName,
    intervention_date: payload.interventionDate,
    start_time: payload.startTime,
    end_time: payload.endTime,
    intervention_type: payload.type,
    status: payload.status,
    title: payload.title,
    description: payload.description,
    diagnosis: payload.diagnosis,
    action_taken: payload.actionTaken,
    photo_path: payload.photoPath,
    notes: payload.notes
  } as never);

  if (error) {
    throw new Error(`Erreur création intervention: ${error.message}`);
  }

  revalidatePath('/interventions');
  revalidatePath('/dashboard');
}
