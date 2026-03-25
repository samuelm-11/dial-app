'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { alertUpdateStatusSchema } from '@/features/alerts/schemas';

async function updateAlertStatus(id: string, status: 'done' | 'dismissed') {
  const payload = alertUpdateStatusSchema.parse({ id, status });
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('alerts')
    .update({ status: payload.status } as never)
    .eq('id', payload.id);

  if (error && !error.message.toLowerCase().includes('does not exist')) {
    throw new Error(`Erreur mise à jour alerte: ${error.message}`);
  }

  revalidatePath('/alerts');
  revalidatePath('/dashboard');
}

export async function markAlertDone(id: string) {
  await updateAlertStatus(id, 'done');
}

export async function dismissAlert(id: string) {
  await updateAlertStatus(id, 'dismissed');
}
